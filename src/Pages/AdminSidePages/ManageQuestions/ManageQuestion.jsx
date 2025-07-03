import { DataGrid } from "@mui/x-data-grid";
import "./Managequestions.css";
import {
  Box,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, Link } from "react-router-dom";
import { ref, get, remove, database } from "../../../Firebase/firebase";
import { useEffect, useState } from "react";

const QuestionsManage = () => {
  const navigate = useNavigate();

  const columns = [
    {
      field: "question",
      headerName: "Question",
      flex: 1,
      cellClassName: "name-column--cell",
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "option1",
      headerName: "Option 1",
      flex: 1,
      cellClassName: "name-column--cell",
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "option2",
      headerName: "Option 2",
      flex: 1,
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "option3",
      headerName: "Option 3",
      flex: 1,
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "option4",
      headerName: "Option 4",
      flex: 1,
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "question_type",
      headerName: "Type",
      flex: 1,
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "answer",
      headerName: "Answer",
      flex: 1,
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <IconButton onClick={() => deleteQuestion(params.row.id)}>
            <DeleteIcon sx={{ "&:active": { color: "#FFBF00" } }} />
          </IconButton>
          <IconButton component={Link} to={`/questionCreation/${params.row.id}`}>
            <EditIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const questionsRef = ref(database, "questions");
      const snapshot = await get(questionsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const formattedData = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setRows(formattedData);
      }
    };

    fetchQuestions();
  }, []);

  const deleteQuestion = async (id) => {
    try {
      await remove(ref(database, `questions/${id}`));
      setRows((prev) => prev.filter((row) => row.id !== id));
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  return (
    <div className="Question_Main_container">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding="1.5rem"
      >
        <h2 style={{ color: "#4b3c69", margin: 0, fontSize: "1.5rem" }}>
          Manage Interview Questions
        </h2>
        <Button
          variant="contained"
          onClick={() => navigate("/questionCreation")}
          sx={{
            backgroundColor: "#937CB4",
            color: "#fff",
            fontWeight: "bold",
            textTransform: "none",
            padding: "0.6rem 1.5rem",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            "&:hover": {
              backgroundColor: "#7a64a6",
            },
          }}
        >
          + Create Question
        </Button>
      </Box>

      <Box
        m="1rem auto"
        height="70vh"
        width="95%"
        borderRadius="12px"
        sx={{
          
          "& .MuiDataGrid-columnHeaders": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid #eee",
            fontSize: "13px",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: "#f1eef6",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#f8f4ff",
          },
          "& .MuiIconButton-root:hover": {
            backgroundColor: "#f3eaff",
            transform: "scale(1.05)",
            transition: "0.2s ease-in-out",
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          rowHeight={40}
          sx={{
            textTransform: "capitalize",
            backgroundColor: "#fff",
            borderRadius: "12px",
          }}
        />
      </Box>
    </div>
  );
};

export default QuestionsManage;
