import { Suspense } from "react";
import {Await, defer, json ,redirect,useRouteLoaderData} from "react-router-dom";
import EventItem from "../components/EventItem";
import EventsList from "../components/EventsList";

function EventDetailPage(){
    const { event , events } = useRouteLoaderData('event-details');
    return (
      <>
        <Suspense fallback = {<p style = {{textAlign:"center"}}>Loading your event...</p>}>
        <Await resolve={event}>
        {loadedEvent => <EventItem event = {loadedEvent}/>}
        </Await>
        </Suspense>

        <Suspense fallback = {<p style = {{textAlign:"center"}}>Loading...</p>}>
        <Await resolve={events}>
        {loadedEvents => <EventsList events={loadedEvents}/>}
        </Await>
        </Suspense>
      </>
    )
}

export default EventDetailPage;

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

async function loadEvent(id){
  const response = await fetch('http://localhost:8080/events/' + id);
  if(!response.ok){
    throw json({message:"Could not load required page"},{status:500});
  }else{
    const resData = await response.json();
    return resData.event;
  }
}

export async function loader({request,params}){
  const id = params.eventId;
  return defer({
    //We could use await before any Promise this will prevent from page Transitioning till the loadEvent()
    //is called hence event Details will always be present whenever we reach that page.
    event:await loadEvent(id),
    events:loadEvents(),
  });
}

export async function action({request,params}){
  const id = params.eventId;
  
  const response = await fetch("http://localhost:8080/events/" + id , {
    method:request.method,
  });

  if(!response.ok){
    throw json( {message:"Could not delete event"},{status:500});
  }
  
  return redirect("/events");
}