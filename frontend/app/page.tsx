import { Button } from "@/components/ui/button";
import dotenv from "dotenv";
import Link from "next/link";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

dotenv.config();
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2 bg-green-300">
      <h1 className="text-3xl font-bold underline"></h1>
      <Link href="/jobfeed">
        <SignedIn>
          <Button variant="default">My Job Feed</Button>
        </SignedIn>

        <SignedOut>
          <SignInButton />
        </SignedOut>
      </Link>
    </div>
  );
}
