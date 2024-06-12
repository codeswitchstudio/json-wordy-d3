d3.json("data.json")
  .then((jsonData) => {
    // Function to extract words from a specific key
    function extractWordsFromKey(obj, key) {
      let words = [];
      function recurse(obj) {
        if (typeof obj === "object") {
          for (const k in obj) {
            if (k === key) {
              words.push(...obj[k].split(/\W+/));
            }
            recurse(obj[k]);
          }
        }
      }
      recurse(obj);
      return words;
    }

    const words = extractWordsFromKey(jsonData, "title").filter(Boolean);
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
      .rotate(() => Math.random() * 45)
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
        .attr("transform", (d) => `translate(${d.x},${d.y})rotate(${d.rotate})`)
        .text((d) => d.text);
    }
  })
  .catch((error) => {
    console.error("Error loading the JSON file:", error);
  });
