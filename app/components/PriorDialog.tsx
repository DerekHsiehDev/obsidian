import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePriorStore } from "@/stores/priorStore";
import { CheckCircleIcon } from "lucide-react";

import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

interface ContributionDay {
  contributionCount: number;
  date: string;
}

type ContributionDay = {
  contributionCount: number;
  date: string;
};

type Week = {
  contributionDays: ContributionDay[];
};

type Dataset = {
  totalContributions: number;
  weeks: Week[];
};

function calculateError(
  actual: Dataset,
  forecast: { [key: string]: number }
): number {
  let actualCounts: { [key: string]: number } = {
    Sunday: 0,
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
  };

  actual.weeks.forEach((week) => {
    week.contributionDays.forEach((day) => {
      let date = new Date(day.date);
      let dayOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ][date.getDay()];
      actualCounts[dayOfWeek] += day.contributionCount;
    });
  });

  let error = 0;
  for (let day in actualCounts) {
    error += Math.abs(actualCounts[day] - forecast[day]);
  }

  return error / 7; // average error per day
}

function calculateProbability(dataset: Dataset): { [key: string]: number } {
  let contributionsPerDay: { [key: string]: number[] } = {
    Sunday: [],
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
  };

  dataset.weeks.forEach((week) => {
    week.contributionDays.forEach((day) => {
      let date = new Date(day.date);
      let dayOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ][date.getDay()];
      contributionsPerDay[dayOfWeek].push(day.contributionCount);
    });
  });

  let totalContributions = dataset.totalContributions;
  let probabilityPerDay: { [key: string]: number } = {};

  for (let day in contributionsPerDay) {
    let totalContributionsOnDay =
      contributionsPerDay[day].reduce((a, b) => a + b, 0) + 1; // add one to each count
    probabilityPerDay[day] = totalContributionsOnDay / (totalContributions + 7); // add 7 to the total count (one for each day of the week)
  }

  return probabilityPerDay;
}

function forecastCommitActivity(
  probabilities: { [key: string]: number },
  daysAhead: number
): { [key: string]: number } {
  let forecast: { [key: string]: number } = {};

  for (let day in probabilities) {
    forecast[day] = probabilities[day] * daysAhead;
  }

  return forecast;
}

const transformData = (data: any): (string | number)[][] => {
  const transformedData = [["Day", "Commits"]];

  for (const week in data.weeks) {
    // contributions in week
    for (const day of data.weeks[week].contributionDays) {
      // temp element in array
      const date = new Date(day.date);
      const formattedDate = `${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}/${String(date.getDate()).padStart(2, "0")}`;

      const tempElement = [formattedDate, day.contributionCount];
      transformedData.push(tempElement);
    }
  }

  console.log(transformedData);

  return transformedData;
};

const PriorDialog = () => {
  const [username, setUsername] = useState<string>("");
  const [fileContent, setFileContent] = useState<string>("");

  const {
    githubCommits,
    setGithubCommits,
    medianMeanVariance,
    setMedianMeanVariance,
    setGithubDailyCommits,
  } = usePriorStore();

  function dayOfWeekEffect(dataset: any): { [key: string]: number } {
    let contributionsPerDay: { [key: string]: number[] } = {
      Sunday: [],
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
    };

    dataset.weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        let date = new Date(day.date);
        let dayOfWeek = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ][date.getDay()];
        contributionsPerDay[dayOfWeek].push(day.contributionCount);
      });
    });

    let averageContributionsPerDay: { [key: string]: number } = {};
    for (let day in contributionsPerDay) {
      let average =
        contributionsPerDay[day].reduce((a, b) => a + b, 0) /
        contributionsPerDay[day].length;
      averageContributionsPerDay[day] = average;
    }

    let statsContributionsPerDay: {
      [key: string]: {
        average: number;
        mean: number;
        median: number;
        variance: number;
      };
    } = {};
    for (let day in contributionsPerDay) {
      let values = contributionsPerDay[day];
      let mean = values.reduce((a, b) => a + b, 0) / values.length;

      values.sort((a, b) => a - b);
      let median =
        (values[(values.length - 1) >> 1] + values[values.length >> 1]) / 2;

      let variance =
        values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;

      statsContributionsPerDay[day] = { average: mean, mean, median, variance };
    }

    console.log(statsContributionsPerDay);
    setMedianMeanVariance(statsContributionsPerDay);

    return averageContributionsPerDay;
  }

  const handleSubmit = async () => {
    const response = await fetch(`/api/github?userName=${username.trim()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("HTTP error", response.status);
    } else {
      const contributionRes = await response.json();
      console.log(
        contributionRes.data.user.contributionsCollection.contributionCalendar
      );

      const dataset =
        contributionRes.data.user.contributionsCollection.contributionCalendar;

      // get 75% of dataset
      const trainingDataset = {
        totalContributions: dataset.totalContributions ,
        weeks: dataset.weeks.slice(
        0,
        Math.floor(dataset.weeks.length * 0.90)
      )};

      const testingDataset = {
        totalContributions: dataset.totalContributions,
        weeks: dataset.weeks.slice(
        Math.floor(dataset.weeks.length * 0.90),
        dataset.length
      )};

      const probabilities = calculateProbability(trainingDataset);

      console.log("probabilities", probabilities);

      const newData = transformData(
        contributionRes.data.user.contributionsCollection.contributionCalendar
      );

      const dayData = dayOfWeekEffect(
        contributionRes.data.user.contributionsCollection.contributionCalendar
      );

      // Forecast commit activity for the next 7 days
      const forecast = forecastCommitActivity(probabilities, 7);


      const error = calculateError(testingDataset, forecast);
      console.log("error", error)
      console.log("forecast", forecast);

      // Prepare the forecasted data for the chart
      const forecastedData = Object.entries(forecast).map(([day, count]) => [
        day,
        undefined,
        count,
      ]);

      const combinedDataWithForcast = transformAndCombineData(
        newData,
        forecastedData
      );

      console.log("combined data", combinedDataWithForcast);

      setGithubCommits(combinedDataWithForcast);
      setGithubDailyCommits(dayData);
      console.log(newData);
      console.log(githubCommits);
    }

    console.log(fileContent);
  };

  const transformAndCombineData = (actualData, forecastData) => {
    // Convert actual data dates to Date objects and ensure commit counts are numbers
    const actualDataWithDates = actualData.map((entry) => {
      return [new Date(entry[0]), Number(entry[1]), null];
    });

    // Sort the data by date
    actualDataWithDates.sort((a, b) => a[0] - b[0]);

    // Map forecast data to weekdays and ensure forecast counts are numbers
    const forecastMap = forecastData.reduce((map, entry) => {
      map[entry[0]] = entry[2] !== null ? Number(entry[2]) : null;
      return map;
    }, {});

    // Combine actual data with forecast data
    const combinedData = actualDataWithDates.map((entry) => {
      const dayOfWeek = entry[0].toLocaleDateString("en-US", {
        weekday: "long",
      });
      entry[2] =
        forecastMap[dayOfWeek] !== undefined ? forecastMap[dayOfWeek] : null;
      return entry;
    });

    // Add header row
    combinedData.unshift(["Date", "Actual Commits", "Forecasted Commits"]);

    return combinedData;
  };

  return (
    <Dialog>
      <DialogTrigger>
        <button className="ml-6 inline-flex items-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">
          Reset Priors
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add your resume and GitHub</DialogTitle>
          <DialogDescription>
            <div>
              <label
                htmlFor="github username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                GitHub username
              </label>
              <div className="mt-2">
                <input
                  name="github username"
                  id="github-username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="derekhsiehdev"
                />
              </div>
            </div>
            <label
              htmlFor="resume-content"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Resume Text Content
            </label>
            <div className="mt-2 mb-2">
              <textarea
                name="resume-content"
                id="resume-content"
                value={fileContent}
                onChange={(event) => setFileContent(event.target.value)}
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Enter your resume content here"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                disabled={!username || fileContent.length === 0}
                className={`inline-flex items-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                  !username || fileContent.length === 0
                    ? "bg-indigo-300"
                    : "bg-indigo-600"
                }`}
                onClick={handleSubmit}
              >
                <CheckCircleIcon
                  className="-ml-0.5 h-5 w-5"
                  aria-hidden="true"
                />
                Finish
              </button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

const Dropzone = ({ files, setFiles }: { files: any; setFiles: any }) => {
  const onDrop = useCallback((acceptedFiles: any) => {
    setFiles(acceptedFiles);
    // Handle file upload here
    console.log(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="container mx-auto p-4">
      <div
        {...getRootProps()}
        className="border-dashed border-4 border-gray-200 py-12 px-4 text-center cursor-pointer"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-gray-500">Drop the files here...</p>
        ) : (
          <p className="text-gray-500">Add your most recent resume here.</p>
        )}
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Uploaded Files</h2>
        <ul>
          {files.map((file, index) => (
            <li key={index} className="text-gray-700">
              {file.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PriorDialog;
