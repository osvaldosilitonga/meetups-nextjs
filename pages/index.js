import { MongoClient } from "mongodb";
import Head from "next/head";

import MeetupList from "../components/meetups/MeetupList";

const user = process.env.MONGODB_USER;
const pass = process.env.MONGODB_PASSWORD;
const database = process.env.MONGODB_DATABASE;
// const uri = `mongodb://${user}:${pass}@ac-yw77jnr-shard-00-00.7gwuoqk.mongodb.net:27017,ac-yw77jnr-shard-00-01.7gwuoqk.mongodb.net:27017,ac-yw77jnr-shard-00-02.7gwuoqk.mongodb.net:27017/?ssl=true&replicaSet=atlas-elxqug-shard-0&authSource=admin&retryWrites=true&w=majority`;
const uri = `mongodb+srv://${user}:${pass}@meetupscluster.7gwuoqk.mongodb.net/?retryWrites=true&w=majority`;

// ----- Export default -----
const HomePage = (props) => {
  return (
    <>
      <Head>
        <title>Home | Meetup</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React meetup!"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  );
};

// Pre-Render (Menyediakan data berupa props ke komponen HomePage)
export const getStaticProps = async () => {
  const client = await MongoClient.connect(uri);
  const db = client.db(database);
  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        id: meetup._id.toString(),
        title: meetup.title,
        address: meetup.address,
        description: meetup.description,
        image: meetup.image,
      })),
    },
    revalidate: 5, // --- Number in second
  };
};

// getServerSideProp => menyediakan data yang dikerjakan di server setiap ada request
// export const getServerSideProps = async (context) => {
//   const req = context.req;
//   const res = context.res;

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// };

export default HomePage;
