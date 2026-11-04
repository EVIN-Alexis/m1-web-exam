import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button, Card, Descriptions, Skeleton, message } from "antd";
import axios from "axios";
import type { BikeModel } from "../models/BikeModel";

type Props = {
  bikeId: string;
};

export const BikeDetailsPage = ({ bikeId }: Props) => {
  const [bike, setBike] = useState<BikeModel | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<BikeModel>(`http://localhost:3000/bikes/${bikeId}`)
      .then((result) => setBike(result.data))
      .catch(() => message.error("Vélo introuvable"))
      .finally(() => setLoading(false));
  }, [bikeId]);

  if (loading) return <Skeleton active />;

  if (!bike) {
    return (
      <div style={{ padding: 24 }}>
        <p>Vélo introuvable.</p>
        <Button onClick={() => navigate({ to: "/bikes/" })}>
          Retour au catalogue
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Button
        onClick={() => navigate({ to: "/bikes/" })}
        style={{ marginBottom: 20 }}
      >
        ← Retour au catalogue
      </Button>

      <Card title={`${bike.brand} ${bike.model}`}>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Marque">{bike.brand}</Descriptions.Item>
          <Descriptions.Item label="Modèle">{bike.model}</Descriptions.Item>
          <Descriptions.Item label="Description">{bike.description}</Descriptions.Item>
          <Descriptions.Item label="Catégorie">{bike.category}</Descriptions.Item>
          <Descriptions.Item label="Matériau">{bike.frameMaterial}</Descriptions.Item>
          <Descriptions.Item label="Taille du cadre">{bike.frameSizeCm} cm</Descriptions.Item>
          <Descriptions.Item label="Taille des roues">{bike.wheelSizeInches} pouces</Descriptions.Item>
          <Descriptions.Item label="Vitesses">{bike.gearCount}</Descriptions.Item>
          <Descriptions.Item label="Poids">{bike.weightKg} kg</Descriptions.Item>
          <Descriptions.Item label="Électrique">{bike.electric ? "Oui" : "Non"}</Descriptions.Item>
          <Descriptions.Item label="Prix">
            {(bike.priceCents / 100).toFixed(2)} €
          </Descriptions.Item>
          <Descriptions.Item label="Identifiant">{bike.id}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};