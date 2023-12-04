"use client";
import { Fragment, useState } from "react";
import { Menu, Popover, Transition, Dialog } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { Logo } from "./Logo";
import EyeCalibration from "@/components/EyeCalibration";
import { useDataStore } from "@/stores/dataStore";
import PriorDialog from "./PriorDialog";

const user = {
  name: "Chelsea Hagon",
  email: "chelsea.hagon@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};
const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Calendar", href: "#", current: false },
  { name: "Teams", href: "#", current: false },
  { name: "Directory", href: "#", current: false },
];
const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
//  let [calibrationOpen, setCalibrationOpen] = useState(true);
 const [calibrationOpen, setCalibrationOpen] = useState(false);
 const [priorsOpen, setPriorsOpen] = useState(true);

  const { currentEyeTrackingState } = useDataStore()

  return (
    <>
      <Popover
        as="header"
        className={({ open }) =>
          classNames(
            open ? "fixed inset-0 z-40 overflow-y-auto" : "",
            "bg-white shadow-sm lg:static lg:overflow-y-visible"
          )
        }
      >
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="relative flex justify-between lg:gap-8 xl:grid xl:grid-cols-12">
                <div className="flex md:absolute md:inset-y-0 md:left-0 lg:static xl:col-span-2">
                  <div className="flex flex-shrink-0 items-center">
                    <a href="#">
                      <Logo height="60" />
                    </a>
                  </div>
                </div>
                <div className="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-6">
                  <div className="flex items-center px-6 py-4 md:mx-auto md:max-w-3xl lg:mx-0 lg:max-w-none xl:px-0">
                    <div className="w-full">

                      <div>
                        {currentEyeTrackingState}
                      </div>

                    </div>
                  </div>
                </div>
              
                <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-4 w-full">
                  <button
                    type="button"
                    className="relative ml-5 flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                  </button>

                  <button onClick={() => setCalibrationOpen(!calibrationOpen)}>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                  <PriorDialog/>
                  <button
                    className="ml-6 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Skip Question
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </Popover>

      <Transition show={calibrationOpen} as={Fragment}>
        <Dialog
          open={calibrationOpen}
          onClose={() => setCalibrationOpen(false)}
          className="fixed inset-0 flex items-center justify-center"
        >
          <EyeCalibration setCalibrationOpen={setCalibrationOpen} />
        </Dialog>
      </Transition>

          
    </>
  );
}
