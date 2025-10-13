import React from "react";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import LatestProjects from "../components/LatestProjects";
import LatestNews from "../components/LatestNews";
import SEO from "../components/SEO";

const Home: React.FC = () => {
  return (
    <>
      <SEO
        title="موسوعه الشنقيطيه"
        description="موسوعة شاملة تجمع التراث العلمي لعلماء وكتاب بلاد شنقيط، تشمل المخطوطات، التحقيقات، الكتب، والأبحاث في العلوم الشرعية واللغوية والاجتماعية. اكتشف آلاف المخطوطات النادرة والكتب المحققة من التراث الموريتاني."
        keywords="شنقيط, موريتانيا, تراث شنقيطي, مخطوطات, كتب تراثية, علماء موريتانيا, فقه مالكي, علوم شرعية, علوم لغوية, تحقيق مخطوطات, تراث إسلامي, أدب عربي, شعر موريتاني"
        type="website"
      />
      <Hero />
      <LatestProjects />
      <Categories />
      <LatestNews />
    </>
  );
};

export default Home;
