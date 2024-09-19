


export const CheckImageExtensionAll = (filename) => {

    const imgType = ['txt', 'docx', 'pdf','apng', 'avif', 'gif', 'jpg', 'jpeg', 'png', 'svg', 'webp','mp4', 'wewbm', 'ogg'] ;
    var  fileType =  filename['name'].split('.').pop();
    const acceptFiles=  imgType.includes(fileType)
   return acceptFiles;
   };


export const getParam = (paramName) => {

    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(paramName);
   };

export const reportType = (incidentId) => {
    switch(incidentId) {
        case "1":
          return "Police report";
        case "2":
          return "Traffic report";
        case "3":
          return "Car crash report";
        case "5":
          return "Weather report";
        default:
          return "Unknown report";
      }
   };

