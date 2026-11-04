import axios from "axios";
import { useState } from "react";
import type {
  BikeModel,
  BikesPageModel,
  CreateBikeModel,
  UpdateBikeModel,
} from "../models/BikeModel";

const API_URL = "http://localhost:3000/bikes";
export const BIKES_PAGE_SIZE = 10;

export const useBikesProvider = () => {
  const [bikes, setBikes] = useState<BikeModel[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const load = (targetPage: number = page) => {
    setIsLoading(true);

    axios
      .get<BikesPageModel>(API_URL, {
        params: { page: targetPage, limit: BIKES_PAGE_SIZE },
      })
      .then((result) => {
        const lastPage = Math.max(
          1,
          Math.ceil(result.data.totalCount / BIKES_PAGE_SIZE),
        );

        if (targetPage > lastPage) {
          load(lastPage);
          return;
        }

        setBikes(result.data.bikes);
        setTotalCount(result.data.totalCount);
        setPage(targetPage);
      })
      .finally(() => setIsLoading(false));
  };

  const createBike = (input: CreateBikeModel) =>
    axios.post(API_URL, input).then(() => load(1));

  const updateBike = (id: string, input: UpdateBikeModel) =>
    axios.patch(`${API_URL}/${id}`, input).then(() => load());

  const deleteBike = (id: string) =>
    axios.delete(`${API_URL}/${id}`).then(() => load());

  return {
    bikes,
    totalCount,
    page,
    isLoading,
    load,
    createBike,
    updateBike,
    deleteBike,
  };
};