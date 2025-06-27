<link
  href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
  rel="stylesheet"
></link>;

import "./StoryCreationForm.css";
import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../../utils/ApiRequest";

/**
 * StoryForm Component
 *
 * A form component used for creating or editing a story.
 * A story consists of a title, multiple snapshots (each with heading, content, and optional image files),
 * and optional tags. The form handles validation for fields, file types, and file limits.
 *
 * Features:
 * - Title input with validation for required and allowed characters
 * - Snapshot list with heading, content, and image uploads (max 5 files per snapshot)
 * - Tag selection via checkboxes
 * - File type validation (only .jpg, .jpeg, .png, .svg)
 * - Base64 file reconstruction for previously uploaded files
 * - Dynamic add/remove of snapshots
 * - Sends data to backend using FormData for file compatibility
 * - Redirects to `/Home` after successful submission
 */

const StoryForm = ({ mode, currentStory }) => {
  const [title, setTitle] = useState("");
  const [snapshots, setSnapshots] = useState([
    { heading: "", content: "", files: [] },
  ]);
  const [titleError, setTitleError] = useState("");

  const [snapshotErrors, setSnapshotErrors] = useState(
    snapshots.map(() => ({ files: "" })) // Default error for files of each snapshot
  );

  const tags = [
    "adventure",
    "thriller",
    "science fiction",
    "time travel",
    "mystery",
    "creative",
    "world",
    "tech",
    "poetry",
    "fiction",
  ];

  const [selectedTags, setSelectedTags] = useState([]);
  const navigate = useNavigate();

  // check if the component is being called for create or edit story
  useEffect(() => {
    if (mode === "edit" && currentStory) {
      setTitle(currentStory.title || "");
      if (currentStory.snapshots) {
        setSnapshots(currentStory.snapshots || []);
      }
      setSelectedTags(currentStory.tags || []);
      setSnapshotErrors(
        (currentStory.snapshots || []).map(() => ({
          heading: "",
          content: "",
          files: "",
        }))
      );
    }
  }, [mode, currentStory]);

  // handle changes of snapshots and file editions
  const handleSnapshotChange = (index, field, value) => {
    setSnapshots((prevSnapshots) => {
      const newSnapshots = [...prevSnapshots];
      //const snapshot = { ...newSnapshots[index] };
      if (field === "files") {
        const newFiles = validateFiles(index, [...value]); // ensure new array
        //snapshot.files = newFiles;
        newSnapshots[index] = {
          ...newSnapshots[index],
          files: newFiles,
        };
      } else {
        newSnapshots[index] = {
          ...newSnapshots[index],
          [field]: value,
        };
      }
      return newSnapshots;
    });
  };

  useEffect(() => {
    console.log("Rendering component - snapshots:", snapshots);
  }, [snapshots]);

  // adds a new snapshot into the page
  const handleAddSnapshot = () => {
    setSnapshots([...snapshots, { heading: "", content: "", files: [] }]);
    setSnapshotErrors([...snapshotErrors, { heading: "", content: "" }]);
  };

  // deletes a snapshot, making sure there is at least one
  const handleRemoveSnapshot = (index) => {
    if (snapshots.length > 1) {
      const newSnapshots = snapshots.filter((_, i) => i !== index);
      const newSnapshotErrors = snapshotErrors.filter((_, i) => i !== index);
      setSnapshots(newSnapshots);
      setSnapshotErrors(newSnapshotErrors);
    }
  };

  // guarantees no writing fields are empty
  const validateStory = () => {
    let isValid = true;
    if (!title.trim()) {
      setTitleError("Title is required");
      isValid = false;
    } else {
      setTitleError("");
    }
    const newSnapshotErrors = snapshots.map((snapshot) => {
      const errors = { heading: "", content: "" };
      if (!snapshot.heading.trim()) {
        errors.heading = "Heading is required";
        isValid = false;
      }
      if (!snapshot.content.trim()) {
        errors.content = "Content is required";
        isValid = false;
      }
      return errors;
    });
    setSnapshotErrors(newSnapshotErrors);
    return isValid;
  };

  // guarantees there are no unexpected characters using regex
  const validateCharacters = (value) => {
    const validCharacters = /^[a-zA-Z0-9\s.,!?"'():;-]*$/;
    return validCharacters.test(value);
  };

  // limits files per snapshot to 5

  const validateFileCount = (index, files) => {
    const existing = snapshots[index]?.files || [];
    console.log(
      `Validating file count. Existing: ${existing.length}, New: ${files.length}`
    );

    if (existing.length + files.length > 5) {
      setSnapshotErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[index] = newErrors[index] || {};
        newErrors[index].files = "Limit is 5 files attached";
        return newErrors;
      });
      return false;
    } else {
      setSnapshotErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[index] = newErrors[index] || {}; // Ensure index exists
        newErrors[index].files = ""; // Clear the files error for this snapshot
        return newErrors;
      });
      return true;
    }
  };
  useEffect(() => {
    console.log("Snapshot errors updated:", snapshotErrors);
  }, [snapshotErrors]);

  // makes sure files are only of images types
  const validateFiles = (index, files) => {
    let allValid = true;
    // Regex to match file names ending with .jpeg, .png, .svg, or .jpg (case insensitive)
    const acceptedImageRegex = /.*\.(jpeg|png|svg|jpg)$/i;

    const validFiles = [];

    // Loop through each file and check if it matches the regex
    files.forEach((file) => {
      if (acceptedImageRegex.test(file.name)) {
        validFiles.push(file);
      } else {
        allValid = false;
      }
    });

    // Update errors only if there is an invalid file
    setSnapshotErrors((prevErrors) => {
      const newErrors = [...prevErrors];
      if (!allValid) {
        newErrors[index].files =
          "Only image files allowed with extensions .jpeg, .png, .svg, or .jpg";
      } else {
        newErrors[index] = newErrors[index] || {};
        newErrors[index].files = "";
      }
      return newErrors;
    });

    return validFiles;
  };

  // handles changes on tags selected
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedTags((prevTags) => [...prevTags, value]);
    } else {
      setSelectedTags((prevTags) => prevTags.filter((tag) => tag !== value));
    }
  };
  function dataURLtoFile(dataUrl, filename) {
    const [header, base64Data] = dataUrl.split(",");
    const mimeMatch = header.match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new File([byteArray], filename, { type: mime });
  }

  // backend integration function
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStory()) return;
    const story = { title, tags: selectedTags, snapshots };
    const formData = new FormData();
    formData.append("title", title);
    selectedTags.forEach((tag) => formData.append("tags[]", tag));

    snapshots.forEach((snapshot, index) => {
      formData.append(`snapshots[${index}][heading]`, snapshot.heading);
      formData.append(`snapshots[${index}][content]`, snapshot.content);

      if (Array.isArray(snapshot.files)) {
        snapshot.files.forEach((file, fileIndex) => {
          if (file instanceof File) {
            formData.append(`snapshots[${index}][files]`, file);
          } else if (file.imageData && file.name) {
            const fileFromBase64 = dataURLtoFile(
              `data:${file.imageType};base64,${file.imageData}`,
              file.name
            );
            formData.append(`snapshots[${index}][files]`, fileFromBase64);
          }
        });
      }
    });
    try {
      let response;
      if (mode === "edit" && currentStory) {
        response = await apiRequest(
          `edit/${currentStory._id}`,
          "PUT",
          formData
        );
        console.log("Updated Story", response);
        navigate("/Home");
      } else if (mode === "create") {
        const response = await apiRequest("create", "POST", formData);
        console.log("Story created:", response);
        navigate("/Home");
      } else {
        console.error("Error:", response.msg);
        navigate("/Home");
      }
    } catch (error) {
      console.error("Failed to create/update story:", error);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit} className="form">
        <div className="div">
          <Form.Group controlId="formTitle" className="form-pair">
            <Form.Label className="form-label">Title</Form.Label>
            <Form.Control
              className="insert"
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => {
                if (validateCharacters(e.target.value)) {
                  setTitle(e.target.value);
                  setTitleError("");
                } else {
                  setTitleError("Invalid characters in title");
                }
              }}
            />
            {titleError && <div className="error-message">{titleError}</div>}
          </Form.Group>
        </div>

        {snapshots.map((snapshot, index) => (
          <div key={index} className="snapshot">
            <Form.Group controlId={`formHeading${index}`}>
              <Form.Label className="form-label">Heading</Form.Label>
              <Form.Control
                className="insert"
                type="text"
                placeholder="Enter heading"
                value={snapshot.heading}
                onChange={(e) => {
                  if (validateCharacters(e.target.value)) {
                    handleSnapshotChange(index, "heading", e.target.value);
                    const newSnapshotErrors = [...snapshotErrors];
                    newSnapshotErrors[index].heading = "";
                    setSnapshotErrors(newSnapshotErrors);
                  } else {
                    const newSnapshotErrors = [...snapshotErrors];
                    newSnapshotErrors[index].heading =
                      "Invalid characters in heading";
                    setSnapshotErrors(newSnapshotErrors);
                  }
                }}
              />
              {snapshotErrors[index] && snapshotErrors[index]?.heading && (
                <div className="error-message">
                  {snapshotErrors[index].heading}
                </div>
              )}
            </Form.Group>

            <Form.Group controlId={`formContent${index}`}>
              <Form.Label className="form-label">Content</Form.Label>
              <Form.Control
                className="insert"
                as="textarea"
                rows={4}
                placeholder="Enter content"
                value={snapshot.content}
                onChange={(e) => {
                  if (validateCharacters(e.target.value)) {
                    handleSnapshotChange(index, "content", e.target.value);
                    const newSnapshotErrors = [...snapshotErrors];
                    newSnapshotErrors[index].content = "";
                    setSnapshotErrors(newSnapshotErrors);
                  } else {
                    const newSnapshotErrors = [...snapshotErrors];
                    newSnapshotErrors[index].content =
                      "Invalid characters in content";
                    setSnapshotErrors(newSnapshotErrors);
                  }
                }}
              />
              {snapshotErrors[index] && snapshotErrors[index]?.content && (
                <div className="error-message">
                  {snapshotErrors[index].content}
                </div>
              )}
            </Form.Group>

            <Form.Group controlId={`formFile${index}`}>
              <Form.Control
                type="file"
                className="custom-file-input"
                id={`customFile${index}`}
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  if (validateFileCount(index, files)) {
                    const newFiles = [...(snapshot.files || []), ...files];
                    handleSnapshotChange(index, "files", newFiles);
                  }
                }}
              />

              {Array.isArray(snapshots[index]?.files) &&
                snapshots[index].files.length > 0 && (
                  <div className="file-list">
                    {snapshots[index].files.map((file, fileIndex) => (
                      <div key={fileIndex} className="file-item">
                        <span>{file.name}</span>
                        <Button
                          variant="white"
                          size="sm"
                          onClick={() => {
                            const newFiles = snapshots[index].files.filter(
                              (_, i) => i !== fileIndex
                            );
                            handleSnapshotChange(index, "files", newFiles);
                          }}
                        >
                          X
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              {snapshotErrors[index] && snapshotErrors[index]?.files && (
                <div className="error-message">
                  {snapshotErrors[index].files}
                </div>
              )}
              <label
                className="custom-file-label"
                htmlFor={`customFile${index}`}
              >
                Add an Image
              </label>
            </Form.Group>

            {snapshots.length > 1 && (
              <Button
                variant="danger"
                className="snapshot-delete"
                onClick={() => handleRemoveSnapshot(index)}
              >
                Delete Snapshot
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="secondary"
          onClick={handleAddSnapshot}
          className="snapshot-button"
        >
          Add a new Snapshot
        </Button>
        <Form.Group controlId="formTags" className="tags">
          <Form.Label className="tag-label">Tags</Form.Label>
          <div className="checkbox">
            {tags.map((tag, index) => (
              <Form.Check
                key={index}
                type="checkbox"
                label={tag}
                value={tag}
                checked={selectedTags.includes(tag)}
                onChange={(e) => handleCheckboxChange(e)}
              />
            ))}
          </div>
        </Form.Group>

        <br></br>
        <Button variant="white" type="submit" className="create-story">
          {mode == "edit" ? "Update Story" : "Create Story"}
        </Button>
      </Form>
    </>
  );
};

export default StoryForm;
