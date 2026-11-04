import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Pagination,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import type {
  BikeModel,
  CreateBikeModel,
} from "../models/BikeModel";
import {
  BIKES_PAGE_SIZE,
  useBikesProvider,
} from "../providers/useBikesProvider";

export const BikesPage = () => {
  const {
    bikes,
    totalCount,
    page,
    isLoading,
    load,
    createBike,
    updateBike,
    deleteBike,
  } = useBikesProvider();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBike, setEditingBike] = useState<BikeModel | null>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm<CreateBikeModel>();

  useEffect(() => {
    load(1);
  }, []);

  const openModal = (bike?: BikeModel) => {
    setEditingBike(bike ?? null);
    form.resetFields();

    if (bike) {
      form.setFieldsValue({
        brand: bike.brand,
        model: bike.model,
        description: bike.description,
        category: bike.category,
        frameMaterial: bike.frameMaterial,
        frameSizeCm: bike.frameSizeCm,
        wheelSizeInches: bike.wheelSizeInches,
        gearCount: bike.gearCount,
        weightKg: bike.weightKg,
        electric: bike.electric,
        priceCents: bike.priceCents,
      });
    }

    setModalOpen(true);
  };

  const handleSubmit = async (values: CreateBikeModel) => {
    setSaving(true);

    try {
      if (editingBike) {
        await updateBike(editingBike.id, values);
        message.success("Vélo modifié !");
      } else {
        await createBike(values);
        message.success("Vélo créé !");
      }

      setModalOpen(false);
    } catch {
      message.error("Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBike(id);
      message.success("Vélo supprimé !");
    } catch {
      message.error("Impossible de supprimer ce vélo. Il est peut-être déjà vendu.");
    }
  };

  const columns = [
    {
      title: "Marque",
      dataIndex: "brand",
    },
    {
      title: "Modèle",
      dataIndex: "model",
      render: (_: string, bike: BikeModel) => (
        <Link to="/bikes/$bikeId" params={{ bikeId: bike.id }}>
          {bike.model}
        </Link>
      ),
    },
    {
      title: "Catégorie",
      dataIndex: "category",
    },
    {
      title: "Électrique",
      dataIndex: "electric",
      render: (value: boolean) => (value ? "Oui" : "Non"),
    },
    {
      title: "Prix",
      dataIndex: "priceCents",
      render: (value: number) => `${(value / 100).toFixed(2)} €`,
    },
    {
      title: "Actions",
      render: (_: unknown, bike: BikeModel) => (
        <Space>
          <Button onClick={() => openModal(bike)}>Modifier</Button>
          <Popconfirm
            title="Supprimer ce vélo ?"
            description="Cette action est définitive."
            onConfirm={() => handleDelete(bike.id)}
            okText="Oui"
            cancelText="Non"
          >
            <Button danger>Supprimer</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 24 }}>
        <h1>Catalogue des vélos</h1>
        <Button type="primary" onClick={() => openModal()}>
          Ajouter un vélo
        </Button>
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={bikes}
        loading={isLoading}
        pagination={false}
      />

      <Pagination
        style={{ marginTop: 24, textAlign: "center" }}
        current={page}
        pageSize={BIKES_PAGE_SIZE}
        total={totalCount}
        showSizeChanger={false}
        onChange={(targetPage) => load(targetPage)}
      />

      <Modal
        title={editingBike ? "Modifier un vélo" : "Ajouter un vélo"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={saving}
        okText={editingBike ? "Modifier" : "Créer"}
        cancelText="Annuler"
        width={650}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ electric: false }}
        >
          <Form.Item name="brand" label="Marque" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="model" label="Modèle" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea />
          </Form.Item>

          <Form.Item name="category" label="Catégorie" rules={[{ required: true }]}>
            <Select
              options={[
                { value: "road", label: "Route" },
                { value: "mountain", label: "Mountain" },
                { value: "gravel", label: "Gravel" },
                { value: "city", label: "Ville" },
              ]}
            />
          </Form.Item>

          <Form.Item name="frameMaterial" label="Matériau du cadre" rules={[{ required: true }]}>
            <Select
              options={[
                { value: "steel", label: "Acier" },
                { value: "aluminium", label: "Aluminium" },
                { value: "carbon", label: "Carbone" },
              ]}
            />
          </Form.Item>

          <Form.Item name="frameSizeCm" label="Taille du cadre (cm)" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="wheelSizeInches" label="Taille des roues (pouces)" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="gearCount" label="Nombre de vitesses" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="weightKg" label="Poids (kg)" rules={[{ required: true }]}>
            <InputNumber min={0.1} step={0.1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="priceCents" label="Prix en centimes" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="electric" label="Vélo électrique" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};