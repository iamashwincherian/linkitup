import { Button } from "@/components/ui/button";
import { auth, signOut } from "../auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="m-2">
      <p>Link It Up</p>
      <small>{JSON.stringify(session?.user)}</small>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/auth/login" });
        }}
      >
        <Button className="mt-2">Logout</Button>
      </form>
    </div>
  );
}
