// import Layout from '../components/Layout'
import dynamic from "next/dynamic";

const Layout = dynamic(() => import("../components/Layout"), {
  ssr: false,
});
export default function Home() {
  return (
    <Layout >
      {/* <h1>Welcome to my app!</h1>
      <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam odit hic consectetur explicabo aliquam vel fugit vitae officia ut, obcaecati ad repudiandae in, possimus quibusdam mollitia fugiat, debitis sequi earum laborum est eveniet quasi unde cupiditate. Illum nesciunt similique reprehenderit?</div>
      
      <strong>Hello World</strong>
      <br />
      <div>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quas, soluta? Fugiat aliquam provident delectus pariatur nostrum aut eos non quasi?</div> */}
    </Layout>
  )
}