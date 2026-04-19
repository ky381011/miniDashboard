import { Configs } from "./Configs";
import { Sidebar } from "./Sidebar";

export function Dashboard() {
  return (
    <div className='bg-mauve-950 min-h-screen flex'>
      <Sidebar />

      <Configs />
    </div>
  )
}
