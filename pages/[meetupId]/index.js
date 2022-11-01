import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";

import MeetupDetail from "../../components/meetups/MeetupDetail";

const user = process.env.MONGODB_USER;
const pass = process.env.MONGODB_PASSWORD;
const database = process.env.MONGODB_DATABASE;
// const uri = `mongodb://${user}:${pass}@ac-yw77jnr-shard-00-00.7gwuoqk.mongodb.net:27017,ac-yw77jnr-shard-00-01.7gwuoqk.mongodb.net:27017,ac-yw77jnr-shard-00-02.7gwuoqk.mongodb.net:27017/?ssl=true&replicaSet=atlas-elxqug-shard-0&authSource=admin&retryWrites=true&w=majority`;
const uri = `mongodb+srv://${user}:${pass}@meetupscluster.7gwuoqk.mongodb.net/?retryWrites=true&w=majority`;

const MeetupDetails = (props) => {
  return (
    <>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </>
  );
};

export async function getStaticPaths() {
  const client = await MongoClient.connect(uri);
  const db = client.db(database);
  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    fallback: "blocking",
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(uri);
  const db = client.db(database);
  const meetupsCollection = db.collection("meetups");

  const selectMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });

  client.close();

  return {
    props: {
      meetupData: {
        id: selectMeetup._id.toString(),
        title: selectMeetup.title,
        address: selectMeetup.address,
        image: selectMeetup.image,
        description: selectMeetup.description,
      },
    },
  };
}

export default MeetupDetails;
