import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import "./QuestionCreation.css";
import { useState } from "react";
import { database, push, ref, set, auth } from "../../../Firebase/firebase"; // adjust path if needed

const QuestionCreation = () => {
  const [data, setData] = useState({
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    answer: "",
    question_type: "",
  });
  const [error, setError] = useState("");

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const validateData = () => {
    if (
      !data.question ||
      !data.answer ||
      !data.option1 ||
      !data.option2 ||
      !data.option3 ||
      !data.option4 ||
      !data.question_type
    ) {
      setError("All fields are required.");
      return false;
    }
    return true;
  };

  const saveQuestionToFirebase = async () => {
    if (!validateData()) return;
    const user = auth.currentUser;
    if (!user) {
      setError("You must be logged in to submit a question.");
      return;
    }

    const questionsRef = ref(database, "questions"); // 'questions' is your collection path
    const newQuestionRef = push(questionsRef); // create a new unique key

    try {
      await set(newQuestionRef, {
        question: data.question,
        option1: data.option1,
        option2: data.option2,
        option3: data.option3,
        option4: data.option4,
        answer: data.answer,
        question_type: data.question_type,
        createdBy: {
          uid: user.uid,
          email: user.email,
        },
      });

      // Reset form after successful save
      setData({
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        answer: "",
        question_type: "",
      });

      setError("");
      alert("Question saved successfully!"); // You can replace this with your popup
    } catch (error) {
      console.error("Error saving question:", error);
      setError("Failed to save question. Please try again.");
    }
  };

  return (
    <div className="interview">
      <h1>Interview Questions Creation</h1>
      <Container>
        <Box
          sx={{
            width: "100%",
            maxWidth: "700px",
            margin: "0 auto",
            padding: "20px",
          }}
        >
          <Grid container spacing={2} direction="column" alignItems="center">
            <Grid
              item
              xs={12}
              sx={{
                width: "100%",
              }}
            >
              <TextField
                name="question"
                value={data.question}
                onChange={onChangeHandler}
                fullWidth
                label="Question"
                required
              />
            </Grid>
            <Grid item container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="option1"
                  value={data.option1}
                  onChange={onChangeHandler}
                  fullWidth
                  label="Option A"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="option2"
                  value={data.option2}
                  onChange={onChangeHandler}
                  fullWidth
                  label="Option B"
                  required
                />
              </Grid>
            </Grid>
            <Grid item container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="option3"
                  value={data.option3}
                  onChange={onChangeHandler}
                  fullWidth
                  label="Option C"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="option4"
                  value={data.option4}
                  onChange={onChangeHandler}
                  fullWidth
                  label="Option D"
                  required
                />
              </Grid>
            </Grid>
            <Grid item container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  name="answer"
                  value={data.answer}
                  onChange={onChangeHandler}
                  fullWidth
                  label="Answer"
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth required>
                  <InputLabel id="type-label">Question Type</InputLabel>
                  <Select
                    labelId="type-label"
                    name="question_type"
                    value={data.question_type}
                    onChange={onChangeHandler}
                    label="Type"
                  >
                    <MenuItem value="Technical">Technical</MenuItem>
                    <MenuItem value="NonTechnical">Non-Technical</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            {error && <Typography color="error">{error}</Typography>}
            <Grid item xs={12}>
              <Button
                variant="contained"
                size="large"
                onClick={saveQuestionToFirebase}
                style={{ color: "#ffffff", backgroundColor: "#937CB4" }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
      {/* <h1>Upload Designs</h1> */}
      {/* <Container>
        <Box sx={{ display: "flex", gap: "2vw", marginTop: "2vh" }}>
          <Box sx={{ width: "30vw" }}>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="design-upload"
              type="file"
              onChange={handleDesignUpload}
            />
            <label htmlFor="design-upload">
              <Button
                variant="contained"
                component="span"
                style={{ color: "#ffffff", backgroundColor: "#937CB4" }}
              >
                <CloudUploadIcon />
                Upload Design
              </Button>
            </label>

            {MainImgdata.image_URL && (
              <div>
                <img
                  src={MainImgdata.image_URL}
                  alt="Design"
                  width="100"
                  height="50"
                />
              </div>
            )}
          </Box>

          <Box sx={{ width: "60vw" }}>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="assets-upload"
              type="file"
              onChange={handleAssetsUpload}
              multiple
            />
            <label htmlFor="assets-upload">
              <Button
                variant="contained"
                component="span"
                style={{ color: "#ffffff", backgroundColor: "#937CB4" }}
              >
                <CloudUploadIcon />
                Upload Assets
              </Button>
            </label>

            {AssetsData.image_URL.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  mt: 2,
                  width: "65vw",
                  flexWrap: "wrap",
                }}
              >
                {AssetsData.image_URL.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Asset ${index}`}
                    width="100"
                    height="50"
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
        <Button
          variant="contained"
          size="large"
          onClick={uploadImages}
          style={{
            color: "#ffffff",
            backgroundColor: "#937CB4",
            marginTop: "2vh",
          }}
        >
          Submit
        </Button>
      </Container> */}
      {/* <SeccessComponent ref={popupRef} /> */}
    </div>
  );
};
export default QuestionCreation;
