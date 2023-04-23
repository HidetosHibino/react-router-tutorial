// global layout for this app.

import {
  Outlet,
  NavLink,
  useLoaderData,
  Form,
  redirect,
  useNavigation,
 } from "react-router-dom";
import { createContact, getContacts } from "../contacts";

// loadしたときに実行したい関数を定義
export async function loader(){
  const contacts = await getContacts();
  return { contacts };
}

// Formをした際に呼ばれるaction で実行したい関数を定義 
export async function action(){
  const contact  = await createContact();
  return redirect(`/contacts/${contact.id}/edit`); // ちょっと違和感ある。redirect は関数を返している？ => Responce を返している
}
// useActionData で return を使うことができる
// https://reactrouter.com/en/main/route/action#returning-responses

export default function Root(){
  // load時に実行した結果をuseLoaderDateを使って取得
  const { contacts } = useLoaderData();
  const navigation = useNavigation();
  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          {/* これまでのインタラクティブUIは、URLを変更するリンクか、データをアクションにポストするフォームのどちらかでした。
          検索フィールドは、その両方を兼ね備えているのが面白いところです。フォームですが、URLを変更するだけで、データは変更しません。 */}
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
                  <NavLink 
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending}) => 
                      // Note that we are passing a function to className. 
                      // When the user is at the URL in the NavLink, then isActive will be true. 
                      // When it's about to be active (the data is still loading) then isPending will be true. 
                      // This allows us to easily indicate where the user is, as well as provide immediate feedback on links that have been clicked but we're still waiting for data to load.
                      // 下のURLでもisActiveになる(contacts/:contactId/edit 等)
                      isActive
                        ? "active"
                        : ( 
                            isPending
                              ? "pending"
                              : ""
                          )
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
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
      <div 
        id="detail"
        className={
          // useNavigation returns the current navigation state: it can be one of "idle" | "submitting" | "loading".
          // ローディング画面
          navigation.state === "loading" ? "loading" : ""
        }
      >
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

// *URL Search Params and GET Submissions
// これまでのインタラクティブUIは、URLを変更するリンクか、データをアクションにポストするフォームのどちらかでした。
// 検索フィールドは、その両方を兼ね備えているのが面白いところです。フォームですが、URLを変更するだけで、データは変更しません。
// 今はReact Routerの<Form>ではなく、普通のHTMLの<Form>になっています。デフォルトでブラウザがこれをどう扱うか見てみましょう：
if (false) {
  <form id="search-form" role="search">
    <input
      id="q"  // ここがUrlに反映される
      aria-label="Search contacts"
      placeholder="Search"
      type="search"
      name="q"
    />
    <div id="search-spinner" aria-hidden hidden={true} />
    <div className="sr-only" aria-live="polite"></div>
  </form>
}
// 以前見たように、ブラウザはinput要素のname属性でフォームをシリアライズすることができます。この入力の名前はqで、そのためURLは?q=となります。もしsearchと名付けたら、URLは?search=となります。
// このフォームは、これまで使ってきた他のフォームとは異なり、<form method="post">がないことに注意してください。デフォルトのメソッドは「get」です。
// つまり、ブラウザが次のドキュメントのリクエストを作成するときに、フォームデータをリクエストのPOSTボディに入れるのではなく、GETリクエストのURLSearchParamsに入れるということです。