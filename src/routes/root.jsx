// global layout for this app.

import {
  Outlet,
  Link,
  useLoaderData,
  Form
 } from "react-router-dom";
import { createContact, getContacts } from "../contacts";

// loadしたときに実行したい関数を定義
export async function loader(){
  const contacts = await getContacts();
  return { contacts };
}

// Formをした際に呼ばれるaction で実行したい関数を定義 
export async function action(){
  const { contact } = await createContact();
  return { contact };
}
// useActionData で return を使うことができる
// https://reactrouter.com/en/main/route/action#returning-responses

export default function Root(){
  // load時に実行した結果をuseLoaderDateを使って取得
  const contacts = useLoaderData();
  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
            />
            <div
              id="search-spinner"
              aria-hidden
              hidden={true}
            />
            <div
              className="sr-only"
              aria-live="polite"
            ></div>
          </form>
          {/* html の form から　Form に帰ることでクライアントサイドルーティングになり、サーバーにリクエストを飛ばさずURLを変更することができる */}
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <Link to={`contacts/${contact.id}`}>
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contents</i>
            </p>
          )}
        </nav>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}

// We need to tell the root route where we want it to render its child routes. We do that with <Outlet>.

// There are two APIs we'll be using to load data, loader and useLoaderData. 
// First we'll create and export a loader function in the root module, 
// then we'll hook it up to the route. 
// Finally, we'll access and render the data.