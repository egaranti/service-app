import RequestStats from "@/components/requests/RequestStats";

const Home = () => {
  return (
    <RequestStats
      stats={{
        total: requests?.length || 0,
        pending: requests?.filter((r) => r.status === "pending")?.length || 0,
        completed:
          requests?.filter((r) => r.status === "completed")?.length || 0,
      }}
    />
  );
};

export default Home;
