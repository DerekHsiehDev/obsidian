import { NextRequest } from "next/server";
import fetch from "node-fetch";
const TOKEN = process.env.GITHUB_TOKEN;
const query = `
query($userName:String!) {
  user(login: $userName){
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
      }
    }
  }
}
`;

declare namespace Externals {
  namespace Github {
    type ContributionDay = {
      contributionCount: number;
      date: string;
    };

    type ApiResponse = {
      data: {
        user: {
          contributionsCollection: {
            contributionCalendar: {
              totalContributions: number;
              weeks: {
                contributionDays: ContributionDay[];
              }[];
            };
          };
        };
      };
    };
  }
}
async function retrieveContributionData(
  userName: string
): Promise<Externals.Github.ApiResponse> {
  const variables = `
  {
    "userName": "${userName}"
  }
`;
  const body = {
    query,
    variables,
  };
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(body),
  });
  return res.json();
}


export async function GET(request: NextRequest) {
    // @ts-ignore
    const userName = String(request.nextUrl.searchParams.get('userName'));

    // check if username is empty

    if(!userName) return new Response("Username is empty", { status: 400 })

    const response = await retrieveContributionData(userName);
    return new Response(JSON.stringify(response), { status: 200 });
}