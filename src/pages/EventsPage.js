import { Suspense } from 'react';
import { Await, defer, json, useLoaderData } from 'react-router-dom';

import EventsList from '../components/EventsList';


function EventsPage() {
  const { events } = useLoaderData();
  return (
    <Suspense fallback = {<p style = {{textAlign:'center'}}>Loading...</p>}>
    {/*Function will be executed once events has been loaded*/}
    <Await resolve={events}>
      {(loadedEvents) => <EventsList events={loadedEvents}/>}
    </Await>
    </Suspense>
  );
}

export default EventsPage;

async function loadEvents(){
  const response = await fetch('http://localhost:8080/events');
  if (!response.ok) {
      // throw new Response(
      // JSON.stringify({message:"Data could not fetched"}),
      // {status:500},
      // );
      throw json(
          {message:"Data could not be fetched"},
          {
              status:500,
          }
      );
  } else {
    const resData = await response.json();
    return resData.events;
  }
}

//Defer is a function that takes many async functions as keys and execute them and give result.
//Here I am using only one function so one key for that
export function loader(){
    return defer({
      events:loadEvents(),
    });
};