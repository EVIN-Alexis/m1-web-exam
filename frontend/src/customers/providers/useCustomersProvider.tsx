import axios from "axios";
import { useState } from "react";
import type {
  CreateCustomerModel,
  CustomerModel,
  CustomersPageModel,
} from "../models/CustomerModel";

export const CUSTOMERS_PAGE_SIZE = 10;

export const useCustomersProvider = () => {
  const [customers, setCustomers] = useState<CustomerModel[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const load = (targetPage: number = page) => {
    setIsLoading(true);
    axios
      .get<CustomersPageModel>("http://localhost:3000/customers", {
        params: { page: targetPage, limit: CUSTOMERS_PAGE_SIZE },
      })
      .then((result) => {
        const lastPage = Math.max(
          1,
          Math.ceil(result.data.totalCount / CUSTOMERS_PAGE_SIZE),
        );
        // La page n'existe plus (ex. son dernier client vient d'être supprimé)
        if (targetPage > lastPage) return load(lastPage);
        setCustomers(result.data.customers);
        setTotalCount(result.data.totalCount);
        setPage(targetPage);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  const deleteCustomer = (id: string) => {
    axios.delete(`http://localhost:3000/customers/${id}`).then(() => load());
  };

  // Renvoie la requête pour que l'appelant gère les erreurs (ex. email déjà utilisé)
  const createCustomer = (input: CreateCustomerModel) =>
    axios
      .post<CustomerModel>("http://localhost:3000/customers", input)
      .then(() => load());

  return { customers, totalCount, page, load, isLoading, deleteCustomer, createCustomer };
};