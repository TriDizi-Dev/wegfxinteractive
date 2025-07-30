import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { ref, get, set, remove, database } from "../../../Firebase/firebase";
import "./ManageCoupons.css"

const ManageCoupons = () => {
  const [couponCode, setCouponCode] = useState("");
  const [percentage, setPercentage] = useState("");
  const [coupons, setCoupons] = useState({});

  useEffect(() => {
    const fetchCoupons = async () => {
      const couponRef = ref(database, "coupons");
      const snapshot = await get(couponRef);
      if (snapshot.exists()) {
        setCoupons(snapshot.val());
      }
    };

    fetchCoupons();
  }, []);

  const handleCreateCoupon = async () => {
    if (!couponCode || !percentage) return;
    await set(ref(database, `coupons/${couponCode}`), {
      code: couponCode,
      percentage: Number(percentage),
    });
    setCoupons((prev) => ({
      ...prev,
      [couponCode]: { code: couponCode, percentage: Number(percentage) },
    }));
    setCouponCode("");
    setPercentage("");
  };

  const handleDelete = async (code) => {
    await remove(ref(database, `coupons/${code}`));
    setCoupons((prev) => {
      const copy = { ...prev };
      delete copy[code];
      return copy;
    });
  };

  return (
    <Box p={3} className="manage-coupons-container">
      <Typography variant="h5" mb={2} fontWeight="bold" color="#4b3bbf">
        Manage Coupons
      </Typography>

      <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
        <TextField
          label="Coupon Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
        />
        <TextField
          label="Percentage"
          type="number"
          value={percentage}
          onChange={(e) => setPercentage(e.target.value)}
        />
        <Button variant="contained" sx={{ backgroundColor: "#937CB4" }} onClick={handleCreateCoupon}>
          Add Coupon
        </Button>
      </Box>

      <Box mt={2}>
        {Object.values(coupons).length > 0 ?
        Object.values(coupons).map((coupon) => (
          <Box
            key={coupon.code}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            bgcolor="#f8f4ff"
            p={2}
            mb={1}
            borderRadius="8px"
          >
            <Typography>
              <strong>{coupon.code}</strong> - {coupon.percentage}%
            </Typography>
            <IconButton onClick={() => handleDelete(coupon.code)}>
              <DeleteIcon sx={{ color: "red" }} />
            </IconButton>
          </Box>
        )):
        <Typography color="gray" textAlign="center" mt={3}>
    No Coupons are Available
  </Typography>
    }
      </Box>
    </Box>
  );
};

export default ManageCoupons;
