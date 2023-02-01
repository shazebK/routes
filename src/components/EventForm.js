import { useNavigate , Form, useActionData , json , redirect} from 'react-router-dom';

import classes from './EventForm.module.css';

function EventForm({ method, event }) {
  const data = useActionData();

  const navigate = useNavigate();
  function cancelHandler() {
    navigate('..');
  }

  return (
    <Form method = {method} className={classes.form}>
     {data && data.errors && Object.values(data.errors).map(error => <li key = {error}>{error}</li>)}
      <p>
        <label htmlFor="title">Title</label>
        <input id="title" type="text" name="title"  required defaultValue={event?event.title:''}/>
      </p>
      <p>
        <label htmlFor="image">Image</label>
        <input id="image" type="url" name="image" required defaultValue={event?event.image:''}/>
      </p>
      <p>
        <label htmlFor="date">Date</label>
        <input id="date" type="date" name="date" required defaultValue={event?event.date:''}/>
      </p>
      <p>
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" rows="5" required defaultValue={event?event.description:''}/>
      </p>
      <div className={classes.actions}>
        <button type="button" onClick={cancelHandler}>
          Cancel
        </button>
        <button type="submit">Save</button>
      </div>
    </Form>
  );
}

export default EventForm;

// This will be called whenever some request like post put will be called
export async function action({request,params}){
  const method = request.method;
  const data = await request.formData();
  const newEvent = {
      title: data.get('title'),
      image: data.get('image'),
      date: data.get('date'),
      description:data.get('description'),
  }

  let url = "http://localhost:8080/events";

  if(method  === 'PATCH'){
    const id = params.eventId;
    url = "http://localhost:8080/events/" + id;
  }

  const response = await fetch(url,
    {
      method: method,
      headers:{
          'Content-Type':'application/json'
      },
      body:JSON.stringify(newEvent),
  });

  if(response.status === 422){
      return response;
  }
  
  if(!response.ok){
      throw json({message:'Sorry! Form could not be submitted'},{status:500});
  }

  return redirect("/events");
}
