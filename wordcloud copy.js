//This code extracts words from the JSON data, counts their occurrences, and generates a word cloud where the font size of each word is proportional to its frequency in the data.
//i get this console error message from the above: TypeError: d3.rollup is not a function at wordcloud.js:44:23
//The error occurs because d3.rollup is available in D3 version 6 and later, while the code uses D3 version 5. To fix this issue, we will use a different approach to count word occurrences that is compatible with D3 version 5.
//This code does not rely on d3.rollup and should work with D3 version 5.
//It extracts words from the JSON data, counts their occurrences, and
//generates a word cloud where the font size of each word is proportional to its
//frequency in the data.

const jsonData = {
  widget: {
    debug: "on",
    window: {
      title: "Sample Konfabulator Widget",
      name: "main_window",
      width: 500,
      height: 500,
    },
    image: {
      src: "Images/Sun.png",
      name: "sun1",
      hOffset: 250,
      vOffset: 250,
      alignment: "center",
    },
    text: {
      data: "Click Here",
      size: 36,
      style: "bold",
      name: "text1",
      hOffset: 250,
      vOffset: 100,
      alignment: "center",
      onMouseUp: "sun1.opacity = (sun1.opacity / 100) * 90;",
    },
  },
};

function extractWords(obj) {
  let words = [];
  if (typeof obj === "object") {
    for (const key in obj) {
      words.push(...key.split(/\W+/));
      words.push(...extractWords(obj[key]));
    }
  } else if (typeof obj === "string") {
    words.push(...obj.split(/\W+/));
  }
  return words;
}

const words = extractWords(jsonData).filter(Boolean);
const wordCounts = {};

words.forEach((word) => {
  wordCounts[word] = (wordCounts[word] || 0) + 1;
});

const wordData = Object.keys(wordCounts).map((word) => ({
  text: word,
  size: wordCounts[word] * 10,
}));

const svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

const layout = d3.layout
  .cloud()
  .size([width, height])
  .words(wordData)
  .padding(5)
  // .rotate(() => Math.random() * 90)
  .fontSize((d) => d.size)
  .on("end", draw);

layout.start();

function draw(words) {
  svg
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`)
    .selectAll("text")
    .data(words)
    .enter()
    .append("text")
    .style("font-size", (d) => `${d.size}px`)
    .style("font-family", "Impact")
    .style("fill", (d, i) => d3.schemeCategory10[i % 10])
    .attr("text-anchor", "middle")
    // .attr("transform", (d) => `translate(${d.x},${d.y})rotate(${d.rotate})`)
    .attr("transform", (d) => `translate(${d.x},${d.y})`)

    .text((d) => d.text);
}
