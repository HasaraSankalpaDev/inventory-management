// app/your-page-path/page.js
import { redirect } from "next/navigation";

export default function Page() {
  redirect("/login");
}
