"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Edit } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Brand {
  _id: string;
  name: string;
  description: string;
  image: string;
}

export default function AddBrandPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [brandImage, setBrandImage] = useState("");
  const [editBrand, setEditBrand] = useState<Brand | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    const res = await fetch("/api/brands");
    const data = await res.json();
    setBrands(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: brandName, description: brandDescription, image: brandImage }),
    });
    if (res.ok) {
      setBrandName("");
      setBrandDescription("");
      setBrandImage("");
      setIsOpen(false);
      fetchBrands();
    } else {
      const error = await res.json();
      console.error("Add failed:", error.message);
      alert(`Failed to add brand: ${error.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    console.log("Attempting to delete brand with ID:", id);
    const res = await fetch(`/api/brands/${id}`, {
      method: "DELETE",
    });
    console.log("Delete response status:", res.status);
    if (res.ok) {
      fetchBrands();
    } else {
      const error = await res.json();
      console.error("Delete failed:", error.message);
      alert(`Failed to delete brand: ${error.message}`);
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditBrand(brand);
    setBrandName(brand.name);
    setBrandDescription(brand.description);
    setBrandImage(brand.image);
    setEditOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editBrand) {
      const res = await fetch(`/api/brands/${editBrand._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: brandName, description: brandDescription, image: brandImage }),
      });
      if (res.ok) {
        setBrandName("");
        setBrandDescription("");
        setBrandImage("");
        setEditBrand(null);
        setEditOpen(false);
        fetchBrands();
      } else {
        const error = await res.json();
        console.error("Update failed:", error.message);
        alert(`Failed to update brand: ${error.message}`);
      }
    }
  };

  const confirmDelete = (id: string) => {
    setBrandToDelete(id);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="p-6 dark:bg-gray-900 bg-gray-100 min-h-screen">
      <div className="pt-20"></div>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Manage Brands</h1>
        <p className="text-gray-600 dark:text-gray-400">
          View, add, edit, and delete brands efficiently.
        </p>
      </div>

      <Card className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div></div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Add Brand
              </Button>
            </DialogTrigger>
          </Dialog>
        </CardHeader>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 dark:bg-gray-700">
                <TableHead className="text-left text-gray-700 dark:text-gray-300">Number</TableHead>
                <TableHead className="text-left text-gray-700 dark:text-gray-300">Brand Name</TableHead>
                <TableHead className="text-left text-gray-700 dark:text-gray-300">Brand Description</TableHead>
                <TableHead className="text-left text-gray-700 dark:text-gray-300">Image</TableHead>
                <TableHead className="text-left text-gray-700 dark:text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.map((brand, index) => (
                <TableRow
                  key={brand._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <TableCell className="py-4 text-gray-900 dark:text-gray-100">{index + 1}</TableCell>
                  <TableCell className="py-4 text-gray-900 dark:text-gray-100">{brand.name}</TableCell>
                  <TableCell className="py-4 text-gray-900 dark:text-gray-100">
                    {brand.description}
                  </TableCell>
                  <TableCell className="py-4">
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="py-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(brand)}
                      className="mr-2 text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => confirmDelete(brand._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="dark:bg-gray-800">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-gray-900 dark:text-white">
                            Confirm Deletion
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                            Are you sure you want to delete the brand "{brand.name}"? This action
                            cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={async () => {
                              if (brandToDelete) {
                                console.log("Confirming delete for ID:", brandToDelete);
                                await handleDelete(brandToDelete);
                                setDeleteDialogOpen(false);
                                setBrandToDelete(null);
                              }
                            }}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="dark:bg-gray-800 max-w-md">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-gray-900 dark:text-white">Add New Brand</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className=""> {/* Increased gap with space-y-6 */}
            <div className="mb-5">
              <Label htmlFor="brandName" className="text-gray-700 dark:text-gray-300 block mb-2">
                Brand Name
              </Label>
              <Input
                id="brandName"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Enter brand name"
                className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md"
                required
              />
            </div>
            <div className="mb-5">
              <Label htmlFor="brandDescription" className="text-gray-700 dark:text-gray-300 block mb-2">
                Brand Description
              </Label>
              <Input
                id="brandDescription"
                value={brandDescription}
                onChange={(e) => setBrandDescription(e.target.value)}
                placeholder="Enter description"
                className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md"
                required
              />
            </div>
            <div className="mb-5">
              <Label htmlFor="brandImage" className="text-gray-700 dark:text-gray-300 block mb-2">
                Image URL
              </Label>
              <Input
                id="brandImage"
                value={brandImage}
                onChange={(e) => setBrandImage(e.target.value)}
                placeholder="Enter image URL"
                className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md"
                required
              />
            </div>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md"
            >
              Save Brand
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="dark:bg-gray-800 max-w-md">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-gray-900 dark:text-white">Edit Brand</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <Label htmlFor="editBrandName" className="text-gray-700 dark:text-gray-300 block mb-2">
                Brand Name
              </Label>
              <Input
                id="editBrandName"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Enter brand name"
                className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md"
                required
              />
            </div>
            <div>
              <Label htmlFor="editBrandDescription" className="text-gray-700 dark:text-gray-300 block mb-2">
                Brand Description
              </Label>
              <Input
                id="editBrandDescription"
                value={brandDescription}
                onChange={(e) => setBrandDescription(e.target.value)}
                placeholder="Enter description"
                className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md"
                required
              />
            </div>
            <div>
              <Label htmlFor="editBrandImage" className="text-gray-700 dark:text-gray-300 block mb-2">
                Image URL
              </Label>
              <Input
                id="editBrandImage"
                value={brandImage}
                onChange={(e) => setBrandImage(e.target.value)}
                placeholder="Enter image URL"
                className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-md"
                required
              />
            </div>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md"
            >
              Update Brand
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}