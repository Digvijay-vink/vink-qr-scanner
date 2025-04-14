import styled from "@emotion/styled";

export const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: black;
  background-image: url("https://cdn.prod.website-files.com/6763df1916ba4d01dfb217a8/67e68147effdde9eb79ca482_Terrain.webp");
  background-repeat: no-repeat;
  background-position: bottom center;
  background-size: 100% 40%;
  position: relative; /* Add this to ensure proper stacking context */
`;