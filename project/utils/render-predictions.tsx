export const renderPredictions = (predictions, ctx) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const font = "16px sans-serif";
  ctx.font = font;
  ctx.textBaseline = "top";

  predictions.forEach((prediction) => {
    // Skip if the detected object is a person
    if (prediction.class === "person") return;

    const [x, y, width, height] = prediction["bbox"];

    // bounding box
    ctx.strokeStyle = "#00FFFF"; // cyan for all non-person objects
    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, width, height);

    // fill the color (transparent by default)
    ctx.fillStyle = `rgba(0, 255, 255, 0.1)`; // light cyan fill
    ctx.fillRect(x, y, width, height);

    // Draw the label background.
    ctx.fillStyle = "#00FFFF";
    const text = `${prediction.class} (${(prediction.score * 100).toFixed(1)}%)`;
    const textWidth = ctx.measureText(text).width;
    const textHeight = parseInt(font, 10);
    ctx.fillRect(x, y, textWidth + 4, textHeight + 4);

    // Draw the label text
    ctx.fillStyle = "#000000";
    ctx.fillText(text, x, y);
  });
};


