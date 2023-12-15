// import Layout from '../components/Layout'
import dynamic from "next/dynamic";

const Layout = dynamic(() => import("../components/Layout"), {
  ssr: false,
});
export default function Home() {
  return (
    <Layout >
     
    </Layout>
    // <div>Hello</div>
  )
}