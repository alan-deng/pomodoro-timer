//check if document already has the div
if (!document.getElementById("darknessDiv")) {
  try {
    var styleDiv = (darknessDiv) => {
      darknessDiv.style.backgroundColor = "black";
      darknessDiv.style.height = "100vh";
      darknessDiv.style.width = "100vw";
      darknessDiv.style.position = "fixed";
      darknessDiv.style.zIndex = 9999;
      darknessDiv.id = "darknessDiv";
    };
    var darknessDiv = document.createElement("div");
    styleDiv(darknessDiv);
    document.body.prepend(darknessDiv);
  } catch {
    styleDiv(darknessDiv);
    document.body.prepend(darknessDiv);
  }
}
