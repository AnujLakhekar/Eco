import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { challenges } from "../../constant";
import { addBadge } from "../../api/firebase";
import { analyzeVideoClient } from "../../api/geminiClient";
import { useAuth } from "../../providers/AuthPrpvider";

const Task = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [inspecting, setInspecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isTrue, setIsTrue] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const intervalRef = useRef(null);
  const { user } = useAuth();

  // Cleanup object URL when file changes or component unmounts
  useEffect(() => {
    return () => {
      if (videoURL) URL.revokeObjectURL(videoURL);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [videoURL]);

  const onSelectVideo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // reset previous
    if (videoURL) URL.revokeObjectURL(videoURL);
    setVideoFile(file);
    setVideoURL(URL.createObjectURL(file));
    setProgress(0);
    setStatus("");
    if (intervalRef.current) clearInterval(intervalRef.current);
    setInspecting(false);
  };

  async function handleUpload() {
    try {
      setIsUploading(true);
      const badgeName = selectedChallenge?.reward?.badge || "Challenge";
      await addBadge(badgeName, user.get.personalInfo.uid);
      setStatus(`Badge awarded: ${badgeName}`);
    } catch (error) {
      console.error("Error adding badge:", error);
      setStatus("Failed to award badge");
    } finally {
      setIsUploading(false);
    }
  }

  const startInspect = async () => {
    if (!videoFile || inspecting) return;
    try {
      setInspecting(true);
      setProgress(0);
      setStatus("Analyzing video with Gemini...");
      setAnalysisResult(null);

  // Analyze on client using Gemini SDK
  const analysis = await analyzeVideoClient(videoFile);

      // 3) Finalize
      setProgress(100);
      // Persist structured result for UI
      setAnalysisResult(analysis);
      setProgress(100);
      // Prefer description and then simple verdict
      if (analysis?.description) {
        setStatus(analysis.description);
      } else {
        const isValid = analysis?.data?.isTrue ?? false;
        const verdict = isValid ? "Inspection complete: Valid ✅" : "Inspection complete: Not Valid ❌";
        setStatus(verdict);
      }
      setIsTrue(!!analysis?.data?.isTrue);
    } catch (e) {
      console.error("inspect error", e);
      setStatus("Inspection failed. Try again.");
    } finally {
      setInspecting(false);
      }
  };

  const resetAll = () => {
    if (videoURL) URL.revokeObjectURL(videoURL);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setVideoFile(null);
    setVideoURL(null);
    setProgress(0);
    setStatus("");
    setInspecting(false);
    setAnalysisResult(null);
  };

  const { id } = useParams();
  const selectedChallenge = Array.isArray(challenges)
    ? challenges.find((c) => String(c.id) === String(id))
    : null;

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {selectedChallenge && (
              <div className="mb-4 p-4 rounded-lg bg-base-200 flex flex-wrap items-center gap-3">
                <span className="font-semibold text-base-content">
                  {selectedChallenge.name}
                </span>
                <span className="badge badge-success">
                  +{selectedChallenge?.reward?.points ?? 0} pts
                </span>
                <span className="badge badge-accent">
                  🏅 {selectedChallenge?.reward?.badge ?? "Badge"}
                </span>
              </div>
            )}
            <h2 className="card-title">Upload Video Proof</h2>
            <p className="text-sm opacity-70">
              Select a video file. We will show an inspection progress
              simulation.
            </p>

            <input
              type="file"
              accept="video/*"
              className="file-input file-input-bordered w-full"
              onChange={onSelectVideo}
            />

            {videoURL && (
              <div className="mt-4">
                <video src={videoURL} controls className="w-full rounded-lg" />
              </div>
            )}

            {inspecting && (
              <div className="mt-4">
                <progress
                  className="progress progress-primary w-full"
                  value={progress}
                  max={100}
                ></progress>
                <div className="text-sm mt-1 text-primary">
                  {status} ({progress}%)
                </div>
              </div>
            )}

            {!inspecting && status && (
              <div className="mt-2 text-sm text-success">{status}</div>
            )}

            {/* Analysis details: category, confidence, reasoning */}
            {analysisResult?.data && (
              <div className="mt-3 p-3 rounded-lg bg-base-200">
                <div className="flex flex-wrap items-center gap-2">
                  {analysisResult.data.category && (
                    <span className="badge badge-info">
                      Category: {analysisResult.data.category}
                    </span>
                  )}
                  {typeof analysisResult.data.confidence === "number" && (
                    <span className="badge badge-ghost">
                      Confidence: {Math.round(analysisResult.data.confidence * 100)}%
                    </span>
                  )}
                  {typeof analysisResult.data.isTrue === "boolean" && (
                    <span className={`badge ${analysisResult.data.isTrue ? "badge-success" : "badge-error"}`}>
                      {analysisResult.data.isTrue ? "Valid" : "Not Valid"}
                    </span>
                  )}
                </div>
                {analysisResult.data.reasoning && (
                  <div className="mt-2 text-sm opacity-80">
                    Reasoning: {analysisResult.data.reasoning}
                  </div>
                )}
              </div>
            )}

            {/* Validation or parsing errors */}
            {analysisResult?.errors?.length > 0 && (
              <div className="mt-3 alert alert-warning">
                <span>
                  Output validation issues:
                  <ul className="list-disc ml-5 mt-1">
                    {analysisResult.errors.map((e, i) => (
                      <li key={i} className="text-xs">{e}</li>
                    ))}
                  </ul>
                </span>
              </div>
            )}

            {isTrue ? (
              <div className="card-actions justify-end mt-4 gap-2">
                {isUploading ? (
                  <button
                    className="btn btn-ghost"
                    onClick={handleUpload}
                    disabled={true}
                  >
                    <span className="loading bg-success"></span>
                  </button>
                ) : (
                  <button
                    className="btn btn-ghost"
                    onClick={handleUpload}
                    disabled={!videoFile && !status && !progress}
                  >
                    Upload
                  </button>
                )}
              </div>
            ) : (
              <div className="card-actions justify-end mt-4 gap-2">
                <button
                  className="btn btn-ghost"
                  onClick={resetAll}
                  disabled={!videoFile && !status && !progress}
                >
                  Reset
                </button>
                <button
                  className="btn btn-primary"
                  onClick={startInspect}
                  disabled={!videoFile || inspecting}
                >
                  {inspecting ? "Inspecting..." : "Start Inspection"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Task;
