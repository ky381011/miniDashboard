import { Configs } from "./Configs";
import { Main } from "./Main";
import { Sidebar } from "./Sidebar";

export function Dashboard() {
  return (
    <div className='bg-mauve-950 min-h-screen min-w-full flex'>
      <Sidebar />
      <Main />
      <Configs />
    </div>
  )
}
