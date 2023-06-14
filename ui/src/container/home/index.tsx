import React, { useState, useRef, useEffect } from 'react';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Route, Routes } from 'react-router-dom';

import Sidebar from '../sidebar/Sidebar';
import UserProfile from '../Profile';
import Pins from '../pins';
import Logo from 'src/assets/logo.png';
import { userQuery } from 'src/utils/sanity/data';
import { User } from 'src/utils/interfaces/User';
import { client } from 'src/utils/sanity/client';

function Home() {
  const [toggleSidebar, setToggleSidebar] = useState<boolean>(false);
  const [user, setUser] = useState<User>({} as User);
  const scrollRef = useRef<HTMLElement>(null);

  const userInfo =
    localStorage.getItem('user') !== 'undefined'
      ? JSON.parse(localStorage.getItem('user') as string)
      : localStorage.clear();

  useEffect(() => {
    const query = userQuery(userInfo?.sub);
    client.fetch(query).then((data) => {
      console.log(data);
      setUser(data[0]);
    });
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, []);

  return (
    <main className="flex bg-gray-50 md:flex-row flex-col h-screen transaction-height duration-75 ease-out">
      {/* Desktop header */}
      <header className="hidden md:flex h-screen flex-initial">
        <Sidebar user={user && user} />
      </header>
      {/* Mobile header */}
      <header className="flex md:hidden flex-row">
        <nav className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu
            fontSize={40}
            className="cursor-pointer"
            onClick={() => setToggleSidebar(true)}
          />
          <Link to="/">
            <img src={Logo} alt="logo" className="w-28" />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.image} alt="logo" className="w-28" />
          </Link>
        </nav>
        {toggleSidebar && (
          <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
            <nav className="absolute w-full flex justify-end items-start p-2">
              <AiFillCloseCircle
                fontSize={30}
                className="cursor-pointer"
                onClick={() => setToggleSidebar(false)}
              />
            </nav>
            <Sidebar user={user && user} closeToggle={setToggleSidebar} />
          </div>
        )}
      </header>
      <main className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pins user={user && user} />} />
        </Routes>
      </main>
    </main>
  );
}

export default Home;
