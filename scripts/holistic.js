// var path = require('path');
// const fs = require('fs');

// Change to video input instead of camera in class video_input
const video_input = document.getElementsByClassName('input_video1')[0];
const video_output = document.getElementsByClassName('output1')[0];
const controlsElement = document.getElementsByClassName('mp_control')[0];
const canvasCtx4 = video_output.getContext('2d');

const train_button = document.getElementById('train');
let isTraining = false;
let pointsforTraining = null;

const fpsControl = new FPS();
const spinner = document.querySelector('.loading');
spinner.ontransitionend = () => {
  spinner.style.display = 'none';
};

function removeElements(landmarks, elements) {
  for (const element of elements) {
    delete landmarks[element];
  }
}

function removeLandmarks(results) {
  if (results.poseLandmarks) {
    removeElements(
      results.poseLandmarks,
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16, 17, 18, 19, 20, 21, 22]
    );
  }
  if (results.faceLandmarks) {
    removeElements(
      results.faceLandmarks,
      [ //  lipsUpperOuter
        61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291,
        //  lipsLowerOuter
        146, 91, 181, 84, 17, 314, 405, 321, 375, 291,
        //  lipsUpperInner
        78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308,
        //  lipsLowerInner
        78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308,
        // rightEyeUpper0
        246, 161, 160, 159, 158, 157, 173,
        // rightEyeLower0
        33, 7, 163, 144, 145, 153, 154, 155, 133,
        // rightEyeUpper1
        247, 30, 29, 27, 28, 56, 190,
        // rightEyeLower1
        130, 25, 110, 24, 23, 22, 26, 112, 243,
        // rightEyeUpper2
        113, 225, 224, 223, 222, 221, 189,
        // rightEyeLower2
        226, 31, 228, 229, 230, 231, 232, 233, 244,
        // rightEyeLower3
        143, 111, 117, 118, 119, 120, 121, 128, 245,
        // rightEyebrowUpper
        156, 70, 63, 105, 66, 107, 55, 193,
        // rightEyebrowLower
        35, 124, 46, 53, 52, 65,
        // rightEyeIris
        473, 474, 475, 476, 477,
        // leftEyeUpper0
        466, 388, 387, 386, 385, 384, 398,
        // leftEyeLower0
        263, 249, 390, 373, 374, 380, 381, 382, 362,
        // leftEyeUpper1
        467, 260, 259, 257, 258, 286, 414,
        // leftEyeLower1
        359, 255, 339, 254, 253, 252, 256, 341, 463,
        // leftEyeUpper2
        342, 445, 444, 443, 442, 441, 413,
        // leftEyeLower2
        446, 261, 448, 449, 450, 451, 452, 453, 464,
        // leftEyeLower3
        372, 340, 346, 347, 348, 349, 350, 357, 465,
        // leftEyebrowUpper
        383, 300, 293, 334, 296, 336, 285, 417,
        // leftEyebrowLower
        265, 353, 276, 283, 282, 295,
        // leftEyeIris
        468, 469, 470, 471, 472,
        // midwayBetweenEyes
        168,
        // noseTip
        1,
        //  noseBottom
        2,
        // noseRightCorner
        98,
        // noseLeftCorner
        327,
        // rightCheek
        205,
        // leftCheek
        425,
        // EXTRA FROM TESSALATION
        3, 4, 5, 6, 8, 9, 11, 12, 15, 16, 18, 19, 20, 32, 
        34, 36, 38, 41, 42, 43, 44, 45, 47, 48, 49, 50, 51, 
        57, 59, 60, 62, 64, 68, 69, 71, 72, 73, 74, 75, 76,
        77, 79, 83, 85, 86, 89, 90, 92, 94, 96, 97, 99, 100, 
        101, 102, 104, 106, 108, 114, 115, 116, 122, 123, 125, 
        126, 129, 131, 134, 135, 137, 138, 139, 140, 141, 142, 
        147, 151, 164, 165, 166, 167, 169, 170, 171, 174, 175, 
        177, 179, 180, 182, 183, 184, 186, 187, 188, 192, 194, 
        195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 206, 
        207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 
        218, 219, 220, 227, 235, 236, 237, 238, 239, 240, 241, 
        242, 248, 250, 262, 264, 266, 268, 271, 272, 273, 274, 
        275, 277, 278, 279, 280, 281, 287, 289, 290, 292, 294, 
        298, 299, 301, 302, 303, 304, 305, 306, 307, 309, 313, 
        315, 316, 319, 320, 322, 325, 326, 328, 329, 330, 331, 
        333, 335, 337, 343, 344, 345, 351, 352, 354, 355, 358, 
        360, 363, 364, 366, 367, 368, 369, 370, 371, 376, 391, 
        392, 393, 394, 395, 396, 399, 401, 403, 404, 406, 407, 
        408, 410, 411, 412, 416, 418, 419, 420, 421, 422, 423, 
        424, 426, 427, 428, 429, 430, 431, 432, 433, 434, 435, 
        436, 437, 438, 439, 440, 447, 455, 456, 457, 458, 459, 
        460, 461, 462 
      ]
    );
  }
}

function connect(ctx, connectors) {
  const canvas = ctx.canvas;
  for (const connector of connectors) {
    const from = connector[0];
    const to = connector[1];
    if (from && to) {
      if (from.visibility && to.visibility &&
          (from.visibility < 0.1 || to.visibility < 0.1)) {
        continue;
      }
      ctx.beginPath();
      ctx.moveTo(from.x * canvas.width, from.y * canvas.height);
      ctx.lineTo(to.x * canvas.width, to.y * canvas.height);
      ctx.stroke();
    }
  }
}

function onResultsHolistic(results) {
  document.body.classList.add('loaded');
  removeLandmarks(results);

  fpsControl.tick();

  canvasCtx4.save();
  canvasCtx4.clearRect(0, 0, video_output.width, video_output.height);
  canvasCtx4.drawImage(
      results.image, 0, 0, video_output.width, video_output.height);
  canvasCtx4.lineWidth = 5;
  if (results.poseLandmarks) {
    if (results.rightHandLandmarks) {
      canvasCtx4.strokeStyle = '#00FF00';
      connect(canvasCtx4, [[
                results.poseLandmarks[POSE_LANDMARKS.RIGHT_ELBOW],
                results.rightHandLandmarks[0]
              ]]);
    }
      if (results.leftHandLandmarks) {
        canvasCtx4.strokeStyle = '#FF0000';
        connect(canvasCtx4, [[
                  results.poseLandmarks[POSE_LANDMARKS.LEFT_ELBOW],
                  results.leftHandLandmarks[0]
                ]]);
    }
  }
  drawConnectors(
      canvasCtx4, results.poseLandmarks, POSE_CONNECTIONS,
      {color: '#00FF00'});
  drawLandmarks(
      canvasCtx4, results.poseLandmarks,
      {color: '#00FF00', fillColor: '#FF0000'});
  drawConnectors(
      canvasCtx4, results.rightHandLandmarks, HAND_CONNECTIONS,
      {color: '#00CC00'});
  drawLandmarks(
      canvasCtx4, results.rightHandLandmarks, {
        color: '#00FF00',
        fillColor: '#FF0000',
        lineWidth: 2,
        radius: (data) => {
          return lerp(data.from.z, -0.15, .1, 10, 1);
        }
      });
  drawConnectors(
      canvasCtx4, results.leftHandLandmarks, HAND_CONNECTIONS,
      {color: '#CC0000'});
  drawLandmarks(
      canvasCtx4, results.leftHandLandmarks, {
        color: '#FF0000',
        fillColor: '#00FF00',
        lineWidth: 2,
        radius: (data) => {
          return lerp(data.from.z, -0.15, .1, 10, 1);
        }
      });
  // drawConnectors(
  //     canvasCtx4, results.faceLandmarks, FACEMESH_TESSELATION,
  //     {color: '#C0C0C070', lineWidth: 1});
  // drawConnectors(
  //     canvasCtx4, results.faceLandmarks, FACEMESH_RIGHT_EYE,
  //     {color: '#FF3030'});
  // drawConnectors(
  //     canvasCtx4, results.faceLandmarks, FACEMESH_RIGHT_EYEBROW,
  //     {color: '#FF3030'});
  // drawConnectors(
  //     canvasCtx4, results.faceLandmarks, FACEMESH_LEFT_EYE,
  //     {color: '#30FF30'}); 
  // drawConnectors(
  //     canvasCtx4, results.faceLandmarks, FACEMESH_LEFT_EYEBROW,
  //     {color: '#30FF30'});
  drawConnectors(
      canvasCtx4, results.faceLandmarks, FACEMESH_FACE_OVAL,
      {color: '#E0E0E0'});
  // drawConnectors(
  //     canvasCtx4, results.faceLandmarks, FACEMESH_LIPS,
  //     {color: '#E0E0E0'});

  canvasCtx4.restore();

  //-FILE COLLECTION --------------------------------------------------------------
  // Path for exported data 
  let DATA_PATH = build_path('MP_Data');
  // let DATA_PATH = path.join('MP_DATA');

  // KEYPOINTS COLLECTION FOR TRAINING AND TESTING
  // run_button.addEventListener('click', (event)=>{
  //   load(results);
  // })
  
  if (isTraining){
    pointsforTraining = extract_keypoints(results);
    pointsforTraining.print();
  }

}

//-Training Mockup----------------------------------------------------------------
// Actions that we try to detect
let actions = nj.array(['ano', 'hi']).tolist();
// Thirty videos worth of data
let no_sequences = 30;
// Videos are going to be 30 frames to length
let sequence_length = 30;
// Folder start
let start_folder = 30;
const timer = ms => new Promise(res => setTimeout(res, ms))
let extracted_keypoints = null;

async function load (results) { // We need to wrap the loop into an async function for this to work
    for (const action of actions) {
      for(const sequence of range(start_folder, start_folder+no_sequences)){
        for (const frame_num in range(sequence_length-1)){
          if (frame_num == 0){
            console.log("Starting Collection");
            console.time(await timer(5000));
            console.log(`Collecting frame#: ${frame_num} for ${action} Video Number ${sequence}`);
            // await timer(1000);
          }else{
            console.log(`Collecting frame#: ${frame_num} for ${action} Video Number ${sequence}`); 
            // await timer(1000);
          }
          extracted_keypoints = extract_keypoints(results);
          // console.log(extracted_keypoints);
        }
      }
      break;
    }
}
//-------------------------------------------------------------------------------


function extract_keypoints(results){
  //-GENERAL INSTRUCTIONS --------------------------------------------------------
  // Count Landmark Length - Array
  // console.log(len(results.faceLandmarks));

  // Accessing a single element
  // console.log(results.faceLandmarks[0].x);
  //------------------------------------------------------------------------------

  //-POSE LANDMARK STORAGE --------------------------------------------------------
  let poseFlatPoints = [];
  if(results.poseLandmarks){
    poseLmarksRes = results.poseLandmarks;
  
    poseLmarksRes.forEach(element => {
      let pose_init = nj.array([element.x, element.y, element.z, element.visibility]).tolist();
      poseFlatPoints.push(pose_init);
    });
    poseFlatPoints = _.flatten(poseFlatPoints);
  }else{
    poseFlatPoints = nj.zeros(24).tolist();
  }
  // console.log(poseFlatPoints);
  //-------------------------------------------------------------------------------

  //-FACE LANDMARK STORAGE --------------------------------------------------------
  let faceFlatPoints = [];
  if(results.faceLandmarks){
    faceLmarksRes = results.faceLandmarks;

    faceLmarksRes.forEach(element => {
      let face_init = nj.array([element.x, element.y, element.z]).tolist();
      faceFlatPoints.push(face_init);
    });
    faceFlatPoints = _.flatten(faceFlatPoints);
  }else{
    faceFlatPoints = nj.zeros(108).tolist();
  }
  // console.log(faceFlatPoints);
  //-------------------------------------------------------------------------------

  //-LHAND LANDMARK STORAGE --------------------------------------------------------
  let lHandPoints = [];
  if(results.leftHandLandmarks){
    lHandLmarksRes = results.leftHandLandmarks;
  
    lHandLmarksRes.forEach(element => {
      let lhand_init = nj.array([element.x, element.y, element.z]).tolist();
      lHandPoints.push(lhand_init);
    });
    lHandPoints = _.flatten(lHandPoints);
  }else{
    lHandPoints = nj.zeros(63).tolist();
  }
  // console.log(lHandPoints);
  //-------------------------------------------------------------------------------

  //-RHAND LANDMARK STORAGE --------------------------------------------------------
  let rHandPoints = [];
  if(results.rightHandLandmarks){
    rHandLmarksRes = results.rightHandLandmarks;
  
    rHandLmarksRes.forEach(element => {
      let rhand_init = nj.array([element.x, element.y, element.z]).tolist();
      rHandPoints.push(rhand_init);
    });
    rHandPoints = _.flatten(rHandPoints);
  }else{
    rHandPoints = nj.zeros(63).tolist();
  }
  // console.log(rHandPoints);
  //-------------------------------------------------------------------------------

  let holistic_keypoints = nj.concatenate(poseFlatPoints, faceFlatPoints, lHandPoints, rHandPoints).tolist();
  holistic_keypoints = tf.tensor1d(holistic_keypoints);
  // holistic_keypoints.print();
  return holistic_keypoints;
}

const holistic = new Holistic({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.1/${file}`;
}});
holistic.onResults(onResultsHolistic);

const camera = new Camera(video_input, {
  onFrame: async () => {
    await holistic.send({image: video_input});
  },
  width: 1280,
  height: 720
});
camera.start();

//-VIDEO COLLECTION --------------------------------------------------------------
// async function onFrame() {
//   if (!video_input.paused && !video_input.ended) {
//     await holistic.send({
//       image: video_input
//     });
//   // https://stackoverflow.com/questions/65144038/how-to-use-requestanimationframe-with-promise    
//     await new Promise(requestAnimationFrame);
//     onFrame();
//   } else
//     setTimeout(onFrame, 500);
// }

// // must be same domain otherwise it will taint the canvas! 
// video_input.src = "../Videos/Ano/Ano_1_VivoY20S_Kian.mp4"; 
// video_input.onloadeddata = (evt) => {
//   let video = evt.target;
//   let isPreLoaded = true;

//   width = video.videoWidth;
//   height = video.videoHeight;
//   video_output.width = video.videoWidth;
//   video_output.height = video.videoHeight;
//   console.log(`Video Width: ${video.videoWidth}, Video Height: ${video.videoHeight}`);

//   if (isPreLoaded){
//     video_input.play(); // Just to pre-load the video
//     onFrame();
//     isPreLoaded = false;
//   }

//   train_button.onclick = () => {
//     isTraining = true;
//     video_input.play();
//     onFrame();
//     console.log("----------------------Training will start----------------------");
//     console.log("----------------------Gathering Keypoints----------------------");
//   }
  
// }
//-------------------------------------------------------------------------------


new ControlPanel(controlsElement, {
      selfieMode: false,
      upperBodyOnly: true,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    })
    .add([
      new StaticText({title: 'MediaPipe Holistic'}),
      fpsControl,
      new Toggle({title: 'Selfie Mode', field: 'selfieMode'}),
      new Toggle({title: 'Upper-body Only', field: 'upperBodyOnly'}),
      new Toggle(
          {title: 'Smooth Landmarks', field: 'smoothLandmarks'}),
      
      new Slider({
        title: 'Min Detection Confidence',
        field: 'minDetectionConfidence',
        range: [0, 1],
        step: 0.01
      }),
      new Slider({
        title: 'Min Tracking Confidence',
        field: 'minTrackingConfidence',
        range: [0, 1],
        step: 0.01
      }),
    ])
    .on(options => {
      video_input.classList.toggle('selfie', options.selfieMode);
      holistic.setOptions(options);
    });

//-PYTHON EQUIVALENTS --------------------------------------------------------------
// Only used during filtering of excess keypoints from the face
function inAButNotInB(A, B) {
  return _.filter(A, function (a) {
    return !_.contains(B, a);
  });
}

// Python's range function
let range = n => [...Array(n).keys()]

// Similar to Python's len() function
Array.prototype.len = function () { return this.length; };
var len = Function.prototype.apply.bind(Array.prototype.len);

// Similar to Python's OS.path.join()
build_path = (...args) => {
  return args.map((part, i) => {
    if (i === 0) {
      return part.trim().replace(/[\/]*$/g, '')
    } else {
      return part.trim().replace(/(^[\/]*|[\/]*$)/g, '')
    }
  }).filter(x=>x.length).join('/')
}