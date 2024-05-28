import { Button } from "@/components/ui/button";
// import { auth, signOut } from "@/auth";
import { LOGIN_PATH } from "@/routes";

export default async function Home() {
  // const session = await auth();

  return (
    <div className="m-2">
      <p>Link It Up</p>
      {/* <small>{JSON.stringify(session?.user)}</small>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: LOGIN_PATH });
        }}
      >
        <Button className="mt-2">Logout</Button>
      </form> */}
    </div>
  );
}
