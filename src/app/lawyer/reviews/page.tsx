'use client';

import React, { useEffect, useState } from 'react';
import { getprofile, fetchLawyerReviews } from '@/service/lawyerService';
import { Star, MessageSquare, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { showToast } from '@/utils/alerts';


const ReviewsPage = () => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [lawyerId, setLawyerId] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
             
                const profileRes = await getprofile();
                if (profileRes && profileRes.data) {
                    const id = profileRes.data._id || profileRes.data.id;
                    setLawyerId(id);

                    const reviewsData = await fetchLawyerReviews(id);
                    setReviews(reviewsData || []);
                }
            } catch (error: any) {
                showToast('error', error.message || 'Failed to load reviews');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen bg-slate-50">
              
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
           

            <main className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto px-6 py-10">

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-teal-100 rounded-2xl">
                            <MessageSquare className="text-teal-700" size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Client Reviews</h1>
                            <p className="text-slate-500 mt-1">See what your clients are saying about you</p>
                        </div>
                    </div>

                    {/* Stats Summary (Optional idea, keeping it simple for now) */}

                    {reviews.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
                            <MessageSquare size={64} className="text-slate-300 mb-4" />
                            <h3 className="text-xl font-bold text-slate-700">No Reviews Yet</h3>
                            <p className="text-slate-500 mt-2">Reviews from your clients will appear here.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {reviews.map((review: any) => (
                                <motion.div
                                    key={review.id || review._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <img
                                            src={review.userImage || "/default-user.jpg"}
                                            alt={review.userName}
                                            className="w-12 h-12 rounded-full object-cover bg-slate-100 border border-slate-100"
                                        />
                                        <div>
                                            <h4 className="font-bold text-slate-900">{review.userName || "Anonymous Client"}</h4>
                                            <div className="flex text-amber-400 gap-0.5 mt-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={14}
                                                        fill={i < review.rating ? "currentColor" : "none"}
                                                        className={i < review.rating ? "" : "text-slate-200"}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-slate-600 leading-relaxed mb-4 min-h-[60px]">
                                        {review.comment}
                                    </p>

                                    <div className="flex items-center text-xs text-slate-400 pt-4 border-t border-slate-50">
                                        <Calendar size={14} className="mr-1.5" />
                                        {new Date(review.createdAt).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ReviewsPage;
