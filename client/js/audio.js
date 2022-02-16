const $audioEl = document.querySelector("audio");
    const $btn = document.querySelector("button");
    // 녹음중 상태 변수
    let isRecording = false;
    // MediaRecorder 변수 생성
    let mediaRecorder = null;
    // 녹음 데이터 저장 배열
    const audioArray = [];
    $btn.onclick = async function (event) {
      if (!isRecording) {
        // 마이크 mediaStream 생성: Promise를 반환하므로 async/await 사용
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        }); // MediaRecorder 생성
        mediaRecorder = new MediaRecorder(mediaStream); // 이벤트핸들러: 녹음 데이터 취득 처리
        mediaRecorder.ondataavailable = (event) => {
          audioArray.push(event.data); // 오디오 데이터가 취득될 때마다 배열에 담아둔다.
        }; // 이벤트핸들러: 녹음 종료 처리 & 재생하기
        mediaRecorder.onstop = (event) => {
          // 녹음이 종료되면, 배열에 담긴 오디오 데이터(Blob)들을 합친다: 코덱도 설정해준다.
          const blob = new Blob(audioArray, { type: "audio/ogg codecs=opus" });
          audioArray.splice(0); // 기존 오디오 데이터들은 모두 비워 초기화한다. // Blob 데이터에 접근할 수 있는 주소를 생성한다.
          const blobURL = window.URL.createObjectURL(blob); // audio엘리먼트로 재생한다.
          $audioEl.src = blobURL;
          $audioEl.play();
        }; // 녹음 시작
        mediaRecorder.start();
        isRecording = true;
      } else {
        // 녹음 종료
        mediaRecorder.stop();
        isRecording = false;
      }
    };




    /**
 * Module dependencies.
 */
 const express = require("express");
 const router = express.Router();
 const multer = require("multer");
 const mongoose = require("mongoose");
 const { ObjectID } = require("mongodb");
 const { createModel } = require("mongoose-gridfs");
 const { Readable } = require("stream");
 
 /**
  * Create Express server && Express Router configuration.
  */
 //global
 let Attachment;
 
 /* GET users listing. */
 router.get("/", function (req, res, next) {
   res.send("audio.js임");
 });
 
 router.post("/add", (req, res) => {
   // console.log(req.body);
   // console.log(req.body.title);
   // console.log(req.body.content);
   console.log("asdfsaf");
   res.send("전송완료");
 });
 
 /**
  * Connect Mongo Driver to MongoDB.
  */
 mongoose
   .connect("mongodb://localhost:27017/trackDB", {
     useNewUrlParser: true,
   })
   .then(() => {
     console.log("Connected to MongoDB");
     // router.listen(8080, function(){ // 함수 안에 함수 : 콜백함수 -> 순차적으로 실행하고 싶을 때 씀
     // console.log('listening on 8080');
     // });
     Attachment = createModel();
   })
   .catch((error) => {
     console.error(error);
   });
 
 /**
  * GET /audio/:trackID
  */
 router.get("/:trackID", (req, res) => {
   if (!req.params.trackID) {
     return res.status(400).json({
       message: "Invalid trackID in URL parameter.",
     });
   }
   res.set("content-type", "audio/mp3");
   res.set("accept-ranges", "bytes");
 
   try {
     const reader = Attachment.read({ _id: ObjectID(req.params.trackID) });
 
     reader.on("data", (chunk) => {
       res.write(chunk);
     });
     reader.on("close", () => {
       console.log("All Sent!");
       res.end();
     });
   } catch (err) {
     console.log(err);
     res.status(404).json({
       message: "Cannot find files that have the ID",
     });
   }
 });
 
 /**
  * POST /audio
  * req : title, singer, file
  */
 router.post("/", (req, res) => {
   const storage = multer.memoryStorage();
   const upload = multer({
     storage: storage,
     limits: { fields: 4, fileSize: 6000000, files: 1, parts: 4 },
   });
   upload.single("track")(req, res, (err) => {
     if (err) {
       console.log(err);
       return res
         .status(400)
         .json({ message: "Upload Request Validation Failed" });
     } else if (!req.body.title) {
       // 변경가능
       return res
         .status(400)
         .json({ message: "No track title in request body" });
     } else if (!req.body.singer) {
       // 변경가능
       return res
         .status(400)
         .json({ message: "No track singer in request body" });
     }
 
     const readStream = Readable.from(req.file.buffer);
     console.log(req.file);
     const options = {
       metadata: `${req.body.title}/${req.body.singer}`,
       filename: req.file.originalname,
       contenttype: "audio/mp3",
     };
     Attachment.write(options, readStream, (err, file) => {
       if (err) return res.status(400).json({ message: "Bad Request" });
       else {
         console.log("Posted! \n" + file.toString());
         return res.status(200).json({
           message: "Successfully Saved!",
           file: file,
         });
       }
     });
   });
 });
 
 /**
  * DELETE /audio/:trackID
  */
 router.delete("/:trackID", (req, res) => {
   if (!req.params.trackID) {
     return res.status(400).json({
       message: "Invalid trackID in URL parameter.",
     });
   }
 
   Attachment.unlink({ _id: ObjectID(req.params.trackID) }, (err, file) => {
     if (err) {
       console.log("Failed to delete\n" + err);
       return res.status(400).json({
         message: "Wrong Request",
         error: err.message,
       });
     }
 
     console.log("Deleted\n" + file);
     return res.status(200).json({
       message: "Successfully Deleted",
       file: file,
     });
   });
 });
 
 module.exports = router;