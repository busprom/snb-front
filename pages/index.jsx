import { Staking } from "../components/staking/staking"

export default function Index({ user }) {
  
  return <Staking user={user} />

}

export async function getServerSideProps({ req, res }) {
 
  return {
    props: {
      
    }
  }
}