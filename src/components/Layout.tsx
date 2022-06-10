import { FC, useState, Fragment } from 'react'
import { Helmet } from 'react-helmet'
import { Dialog, Menu, Transition } from '@headlessui/react'
import { ClockIcon, HomeIcon, MenuAlt1Icon, ViewListIcon, XIcon } from '@heroicons/react/outline'
import { ChevronRightIcon, DotsVerticalIcon, SearchIcon, SelectorIcon } from '@heroicons/react/solid'
import { useAuth, } from '@/uilts'
import { actorController } from "../uilts/ic/CounterActor";
import { authClient } from '@/uilts/AuthClient'
import { Actor, HttpAgent } from '@dfinity/agent'
import {
  idlFactory as Counter_idl,
  canisterId as Counter_canister_id,
} from "../declarations/counter/";
import { AuthClient } from '@dfinity/auth-client'
import { _SERVICE } from "@/declarations/counter/counter.did";

const CounterActor = actorController;

const navigation = [
  { name: 'Home', href: '#', icon: HomeIcon, current: true },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
interface Props {
  head?: any
  title: string
}

export const Layout: FC<Props> = ({ head, children, title }) => {
  const [me, setMe] = useState<string>()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, setUser, isAuthenticated, isAuthReady, logOut } = useAuth();
  const auth = useAuth();
  // console.log(isAuthenticated, isAuthReady, user)

  const onWhoAmI = async () => {
    // const id =await authClient.getIdentity();
    // console.log(id)
    // const actor = await CounterActor.initBaseActor(id)
    // console.log(actor)
    // const b = await actor.callerPrincipal()
    // console.log(b)
    // setMe(b.toString())
    //const authClient = await AuthClient.create();

    const identity = await authClient.getIdentity();
    const agent =  new HttpAgent({
      identity
    });
    
    await agent.fetchRootKey();
    console.log(identity!.getPrincipal().toText())
    const actor = Actor.createActor(Counter_idl, {
      agent: agent,
      canisterId: Counter_canister_id,
    });
    const value = await actor.callerPrincipal();

    console.log(value.toText())
  }
  return (
    <>
      <Helmet>
        <title>{title} | IC Example Web App </title>
        <meta name="description" content="A example web app on the Internet Computer." />
        {head}
      </Helmet>


      <div className="min-h-full">


        {/* Static sidebar for desktop */}
        <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:pt-5 lg:pb-4 lg:bg-gray-100">
          <div className="flex items-center flex-shrink-0 px-6">
            IC Example Web App
          </div>
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="mt-6 h-0 flex-1 flex flex-col overflow-y-auto">
            {/* User account dropdown */}
            {!isAuthenticated && (
              <>
                <p>
                  <button onClick={async () => {
                    await auth.logIn();
                  }} id="sign-in" className="px-8 py-2 rounded-full text-lg focus:outline-none font-medium text-white bg-gradient-to-r from-indigo-600 to-pink-500">
                    Login
                  </button>
                </p>

              </>
            )}
            {isAuthenticated && !user && (

              "Choose Username"
            )}
            {isAuthenticated && user && (
              "User"

            )}
            <p>

              <button
                className="px-8 py-2 rounded-full text-lg focus:outline-none font-medium text-white bg-gradient-to-r from-indigo-600 to-pink-500"
                aria-label="Increment value"
                onClick={onWhoAmI}
              >
                onWhoAmI
              </button>
            </p>
            {/* Sidebar Search */}
            <div className="px-3 mt-5">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div
                  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  aria-hidden="true"
                >
                  <SearchIcon className="mr-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-9 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search"
                />
              </div>
            </div>
            {/* Navigation */}
            <nav className="px-3 mt-6">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50',
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    <item.icon
                      className={classNames(
                        item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                        'mr-3 flex-shrink-0 h-6 w-6'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                ))}
              </div>

            </nav>
          </div>
        </div>
        {/* Main column */}
        <div className="lg:pl-64 flex flex-col">
          {/* Search header */}
          <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 lg:hidden">
            <button
              type="button"
              className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuAlt1Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-1 flex justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex-1 flex">
                <form className="w-full flex md:ml-0" action="#" method="GET">
                  <label htmlFor="search-field" className="sr-only">
                    Search
                  </label>
                  <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                    <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                      <SearchIcon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <input
                      id="search-field"
                      name="search-field"
                      className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent focus:placeholder-gray-400 sm:text-sm"
                      placeholder="Search"
                      type="search"
                    />
                  </div>
                </form>
              </div>
              <div className="flex items-center">
                {/* Profile dropdown */}

              </div>
            </div>
          </div>
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
