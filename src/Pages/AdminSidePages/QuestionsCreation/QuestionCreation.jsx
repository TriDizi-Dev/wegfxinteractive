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
import { useEffect, useState } from "react";
import {
  database,
  push,
  ref,
  set,
  auth,
  get,
  update,
} from "../../../Firebase/firebase"; // adjust path if needed
import { useNavigate, useParams } from "react-router-dom";

const QuestionCreation = () => {
  const { id } = useParams(); // will be undefined for create
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchQuestion = async () => {
        try {
          const snapshot = await get(ref(database, `questions/${id}`));
          if (snapshot.exists()) {
            setData(snapshot.val());
          } else {
            setError("Question not found.");
          }
        } catch (err) {
          console.error("Error fetching question:", err);
          setError("Failed to load question.");
        }
      };
      fetchQuestion();
    }
  }, [id]);

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
      setError("You must be logged in.");
      return;
    }

    try {
      const questionsRef = id
        ? ref(database, `questions/${id}`)
        : push(ref(database, "questions"));

      const payload = {
        ...data,
        createdBy: {
          uid: user.uid,
          email: user.email,
        },
      };

      if (id) {
        await update(questionsRef, payload);
        alert("Question updated successfully!");
      } else {
        await set(questionsRef, payload);
        alert("Question created successfully!");
      }

      setError("");
      navigate("/manageQuestion"); // redirect back to list
    } catch (err) {
      console.error("Error saving/updating question:", err);
      setError("Operation failed. Try again.");
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
              <Grid item  xs={12} sm={6}>
                <FormControl required>
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
                    <MenuItem value="GeneralKnowledge">
                      GeneralKnowledge
                    </MenuItem>
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
    </div>
  );
};
export default QuestionCreation;
