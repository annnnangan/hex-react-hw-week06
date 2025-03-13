import ShowMoreBtn from "../components/ShowMoreBtn";

const Homepage = () => {
  return (
    <div className="container">
      <button className="btn btn-brand-02">Hello</button>
      <ShowMoreBtn
        maxCharacter={20}
        text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus suscipit ducimus quibusdam sed ipsam. Architecto corrupti hic et quisquam doloremque quibusdam aspernatur excepturi, illo repudiandae, nesciunt, ipsa sit maxime enim."
      />
      <h1>首頁123456</h1>
    </div>
  );
};

export default Homepage;
