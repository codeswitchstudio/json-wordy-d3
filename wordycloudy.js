d3.json("hayley.json")
  .then((jsonData) => {
    // Extract words from the JSON dataset
    const words = jsonData.words
      .map((word) =>
        word.text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase()
      )
      .filter(Boolean);

    // Count word occurrences
    const wordCounts = words.reduce((counts, word) => {
      counts[word] = (counts[word] || 0) + 1;
      return counts;
    }, {});

    // Prepare data for word cloud
    const wordData = Object.keys(wordCounts).map((word) => ({
      text: word,
      size: wordCounts[word] * 3,
    }));

    // Set up the word cloud layout
    const svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height");

    const layout = d3.layout
      .cloud()
      .size([width, height])
      .words(wordData)
      .padding(5)
      .rotate(() => ~~(Math.random() * 2) * 90)
      .fontSize((d) => d.size)
      .on("end", draw);

    layout.start();

    // Draw the word cloud
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
