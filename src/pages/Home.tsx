import { Layout } from '@/components'
import { useAuth } from '@/uilts'
import { css } from '@emotion/react'
import { ExclamationIcon } from '@heroicons/react/outline'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import tw from 'twin.macro'

import { actorController } from "../uilts/ic/CounterActor";
const CounterActor = actorController;
const styles = {
  root: css`
    ${tw`p-5`};
  `,
}

export const Home = () => {
  const [me, setMe] = useState<string>()

  const [count, setCount] = useState<string>()
  const refreshCounter = async () => {
    const a = await (await CounterActor.actor).getValue();
    setCount(a.toString())
  }
  const getMe = async () => {
    const a = await (await CounterActor.actor).callerPrincipal();
    setMe(a.toString())
  }

  useEffect(() => {
    refreshCounter()
    getMe()
  }, [])

  const onIncrementClick = async () => {
    await (await CounterActor.actor).increment()
    refreshCounter()
  }
 
  const [error, setError] = useState("");
  const [isCheckingICForUser, setIsCheckingICForUser] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const auth = useAuth();
  // Get a user name from the user's principal and then fetch the user object
  // with all the user's data. Show a loading message between these async
  // backend calls happening.
  useEffect(() => {
    if (!auth.isAuthReady) return;
    if (auth.isAuthenticated && auth.identity !== undefined) {
      setIsCheckingICForUser(true);
      const id = auth.identity.getPrincipal()
      // console.log(id)
      // getUserNameByPrincipal(id).then((username) => {
      //   //console.log(username)
      //   if (username) {
      //     // User exists! Set user and redirect to /feed.
      //     getUserFromCanister(username).then((user) => {
      //       setIsCheckingICForUser(false);
      //       auth.setUser(user!);
      //       navigate("/feed");
      //     });
      //     setIsCheckingICForUser(false);
      //   } else {
      //     // Do nothing. Allow the user to create a userId
      //     setIsCheckingICForUser(false);
      //   }
      // });
    }


  }, [auth.isAuthReady, auth.isAuthenticated, auth.identity]);
  // Submit the form to signup with a new username, the backend ensures that
  // the username is available.
  async function submit(evt: FormEvent) {
    // evt.preventDefault();
    // evt.stopPropagation();
    // setError("");

    // // Get the username entered from the form.
    // const username = usernameInputRef?.current?.value!;
    // setIsSigningIn(true);
    // // Check to make sure this username has not been taken. If this user already
    // // has a username, it should have signed them in already.
    // const isAvailable = await checkUsername(username);

    // if (isAvailable) {
    //   // Create a user on the backend and assign that user to frontend data.
    //   const user = await createUser(username, auth.identity?.getPrincipal());
    //   auth.setUser(user);
    //   setIsSigningIn(false);
    //   navigate("/feed");
    // } else {
    //   setError(`Username '${username}' is taken`);
    //   setIsSigningIn(false);
    // }
  }
  return (
    <Layout title="Home">
      {auth.isAuthenticated && auth.user && (
        <div css={styles.root}>Hello </div>
      )}
      {auth.isAuthenticated && !auth.user && (
        <>

Yay
        </>
      )}
    </Layout>
  )
}
