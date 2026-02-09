import Review from "../models/reviewModel.js";

const createReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);
    console.log(review);

    res.status(201).json({
      status: "Success",
      data: {
        review,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllRevies = async (req, res) => {
  try {
    const reviews = await Reviews.find();

    res.status(200).json({
      status: "Sucess",
      data: {
        reviews,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { createReview, getAllRevies };
