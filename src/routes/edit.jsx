import React from 'react';
import {
  Form,
  useLoaderData,
  redirect,
  useNavigate,
} from 'react-router-dom';
import { updateContact  } from '../contacts';

// request: This is a Fetch Request instance being sent to your route. The most common use case is to parse the FormData from the request
// https://reactrouter.com/en/main/route/action#request
export async function action({request, params}) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
}
// 解説：　const updates = Object.fromEntries(formData);
// Each field in the form is accessible with formData.get(name). 
// For example, given the input field from above, 
// you could access the first and last names like this:
// const firstName = formData.get("first");
// const lastName = formData.get("last");

// const updates = Object.fromEntries(formData);
// updates.first; // "Some"
// updates.last; // "Name"

// The redirect helper just makes it easier to return a response that "tells the app to change locations."


export default function EditContact() {
  const { contact } = useLoaderData();
  const navigate = useNavigate();
  
  return(
    <Form method="post" id="contact-form">
      <p>
        <span>Name</span>
        <input
          placeholder="First"
          aria-label="First name" 
          type="text"
          name="first"
          defaultValue={contact.first}
        />
        <input
          placeholder="Last"
          aria-label="Last name" 
          type="text"
          name="last"
          defaultValue={contact.last}
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          type="text"
          name="twitter"
          placeholder="@jack"
          defaultValue={contact.twitter}
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          type="text"
          name="avatar"
          defaultValue={contact.avatar}
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea
          name="notes"
          defaultValue={contact.notes}
          rows={6}
        />
      </label>
      <p>
        <button type="submit">Save</button>
        <button type="button"
          onClick={()=>{
            navigate(-1)
          }}
        >Cancel</button>
      </p>
    </Form>
  );
};
