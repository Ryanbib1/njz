'use client';

import React from 'react';
import { AlertCircle, CheckCircle2, HelpCircle, Trash2, Edit3, Plus, ChevronRight, MessageSquare, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { ReviewsManagementState, ReviewsManagementHandlers } from '@/backend/hooks/useReviewsManagement';
interface Props {
  state: ReviewsManagementState;
  handlers: ReviewsManagementHandlers;
}
export const ReviewsManagementView = ({
  state,
  handlers
}: Props) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'MATCHED':
        return <CheckCircle2 className="w-4 h-4 text-primary" data-api-unique-id="reviewsmanagementview-r65a425bacd559848-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView" />;
      case 'MISMATCHED':
        return <AlertCircle className="w-4 h-4 text-secondary" data-api-unique-id="reviewsmanagementview-rf1c20e6d2704884c-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView" />;
      default:
        return <HelpCircle className="w-4 h-4 text-muted-foreground" data-api-unique-id="reviewsmanagementview-ra9a469ea7dad5ff0-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView" />;
    }
  };
  const getStatusBadge = (status: string) => {
    const label = state.MATCH_STATUS_LABELS[status as keyof typeof state.MATCH_STATUS_LABELS] || 'Unknown';
    switch (status) {
      case 'MATCHED':
        return <Badge variant="outline" className="border-primary text-primary bg-primary/5 rounded-sm font-body px-2 py-0.5" data-api-unique-id="reviewsmanagementview-rf902c475e01f05f6-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">{label}</Badge>;
      case 'MISMATCHED':
        return <Badge variant="outline" className="border-secondary text-secondary bg-secondary/5 rounded-sm font-body px-2 py-0.5" data-api-unique-id="reviewsmanagementview-r5dd270b769e26b6d-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">{label}</Badge>;
      default:
        return <Badge variant="outline" className="border-muted-foreground text-muted-foreground bg-muted/5 rounded-sm font-body px-2 py-0.5" data-api-unique-id="reviewsmanagementview-r4e77cf31b6ba6cd9-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">{label}</Badge>;
    }
  };
  return <div className="min-h-screen bg-background text-foreground font-body" data-api-unique-id="reviewsmanagementview-ra03d0a7c7feaabdf-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
      {/* HEADER SECTION */}
      <section data-controller-name="Reviews Dashboard Header" className="w-full border-b border-border bg-card" data-api-unique-id="reviewsmanagementview-rd9f76a99638f7e44-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
        <div className="container mx-auto px-8 py-6" data-api-unique-id="reviewsmanagementview-r94b1d8e497af87c4-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4" data-api-unique-id="reviewsmanagementview-r3fe6e47e8467032e-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
            <div className="space-y-1" data-api-unique-id="reviewsmanagementview-r6880ededfb1eb81d-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
              <h1 className="text-4xl font-display tracking-tight text-foreground uppercase" data-api-unique-id="reviewsmanagementview-rc84dbbe23fae79b2-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                Reviews Management
              </h1>
              <p className="text-muted-foreground font-header italic text-lg" data-api-unique-id="reviewsmanagementview-r8da3e8acc24ec6e6-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                Refining the guest experience through authentic feedback
              </p>
            </div>
            <div className="flex items-center gap-3 bg-muted px-4 py-2 rounded-sm border border-border/50" data-api-unique-id="reviewsmanagementview-r3b68744eff1cc3c1-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
              <div className="flex -space-x-1" data-api-unique-id="reviewsmanagementview-r0d0dadaec8336ae8-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                {[...Array(state.totalSlots)].map((_, index) => <div key={index} className={cn("w-3 h-3 rounded-full border border-card", index < state.presentCount ? "bg-primary" : "bg-border/30")} data-api-unique-id="reviewsmanagementview-rdee4a1c7fa76ca8c-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView" data-api-in-loop="1" />)}
              </div>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground" data-api-unique-id="reviewsmanagementview-r068015c9407d463f-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                Sync Status: <span className="text-foreground" data-api-unique-id="reviewsmanagementview-rd8e531fc8b704af2-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">{state.presentCount} / {state.totalSlots}</span> Slots Occupied
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <section data-controller-name="Reviews Management Layout" className="w-full" data-api-unique-id="reviewsmanagementview-rdc46187203e97b58-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
        <div className="container mx-auto px-8 py-10" data-api-unique-id="reviewsmanagementview-r68a702d747f0a937-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start" data-api-unique-id="reviewsmanagementview-ra12e0806a006334f-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
            
            {/* LEFT PANE: Verification List */}
            <div className="lg:col-span-5 space-y-6" data-api-unique-id="reviewsmanagementview-r809e61207d47dede-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
              <div className="flex items-center justify-between" data-api-unique-id="reviewsmanagementview-rf2f07d2176992198-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                <h2 className="text-xl font-header font-bold text-foreground flex items-center gap-2" data-api-unique-id="reviewsmanagementview-re5c04adfca6c9480-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                  <MessageSquare className="w-5 h-5 text-secondary" data-api-unique-id="reviewsmanagementview-rf01241142b0b9ee1-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView" />
                  Review Slot Registry
                </h2>
              </div>
              
              <Card className="rounded-lg overflow-hidden border-border bg-card shadow-xs" data-api-unique-id="reviewsmanagementview-r9e714fe5b214854d-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                {state.isLoading ? <div className="p-20 text-center space-y-4" data-api-unique-id="reviewsmanagementview-rf1a535a9faf69b49-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" data-api-unique-id="reviewsmanagementview-rd1c2713b407fc930-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView" />
                    <p className="text-muted-foreground font-header italic" data-api-unique-id="reviewsmanagementview-r491ebab10a3a3e1f-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">Gathering records...</p>
                  </div> : state.reviews.length === 0 ? <div className="p-20 text-center" data-api-unique-id="reviewsmanagementview-rcf210bf3667a4eb5-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                    <p className="text-muted-foreground font-header italic" data-api-unique-id="reviewsmanagementview-r982df05ab4d6f084-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">No slot data available.</p>
                  </div> : <Table data-api-unique-id="reviewsmanagementview-r98df8937fcdfcf75-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                    <TableHeader className="bg-muted/50" data-api-unique-id="reviewsmanagementview-r05fd91881a8fc5b9-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                      <TableRow className="hover:bg-transparent border-border" data-api-unique-id="reviewsmanagementview-rf2e4386d66e37b51-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                        <TableHead className="w-20 uppercase text-[10px] tracking-widest font-bold text-muted-foreground" data-api-unique-id="reviewsmanagementview-r96b6a19cf97d712a-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">Slot</TableHead>
                        <TableHead className="uppercase text-[10px] tracking-widest font-bold text-muted-foreground" data-api-unique-id="reviewsmanagementview-r0f08807f1d489eaa-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">Reviewer</TableHead>
                        <TableHead className="uppercase text-[10px] tracking-widest font-bold text-muted-foreground" data-api-unique-id="reviewsmanagementview-rd80ee62b4547e824-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">Status</TableHead>
                        <TableHead className="text-right uppercase text-[10px] tracking-widest font-bold text-muted-foreground" data-api-unique-id="reviewsmanagementview-ree162ed4100ba7c0-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody data-api-unique-id="reviewsmanagementview-r45061129518d0e62-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                      {state.reviews.map((review, index) => <TableRow key={review.review_slot} className={cn("group cursor-pointer transition-colors border-border/50", state.activeSlotNumber === review.review_slot ? "bg-accent/20" : "hover:bg-muted/30")} onClick={() => handlers.handleSelectSlot(review.review_slot)} data-api-unique-id="reviewsmanagementview-r256b25334b1ccf06-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView" data-api-in-loop="1">
                          <TableCell className="font-header font-bold text-lg" data-api-unique-id="reviewsmanagementview-r665b68d3c819e17e-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView" data-api-in-loop="1">
                            0{review.review_slot}
                          </TableCell>
                          <TableCell data-api-unique-id="reviewsmanagementview-ra1c68049e2ae467b-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView" data-api-in-loop="1">
                            <div className="flex flex-col" data-api-unique-id="reviewsmanagementview-r1d47fbc74cfbe7ed-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView" data-api-in-loop="1">
                              <span className={cn("font-medium text-sm truncate max-w-[120px]", !review.author_name && "text-muted-foreground italic")} data-api-unique-id="reviewsmanagementview-r4a9df102abb248a4-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView" data-api-in-loop="1">
                                {review.author_name || 'Unassigned'}
                              </span>
                              {review.rating && <div className="flex items-center gap-1 mt-0.5" data-api-unique-id="reviewsmanagementview-re0072173e521ab87-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView" data-api-in-loop="1">
                                  <Star className="w-3 h-3 fill-primary text-primary" data-api-unique-id="reviewsmanagementview-rb26c74d919fa38cd-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView" data-api-in-loop="1" />
                                  <span className="text-[10px] text-muted-foreground font-medium" data-api-unique-id="reviewsmanagementview-r653124d1863edb19-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView" data-api-in-loop="1">{review.rating}.0</span>
                                </div>}
                            </div>
                          </TableCell>
                          <TableCell data-api-unique-id="reviewsmanagementview-rf27db41b926eda65-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView" data-api-in-loop="1">
                            {getStatusBadge(review.match_status)}
                          </TableCell>
                          <TableCell className="text-right" data-api-unique-id="reviewsmanagementview-rc59e4d21a29634db-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView" data-api-in-loop="1">
                            <Button variant="ghost" size="sm" className={cn("h-8 w-8 p-0 rounded-sm transition-all", state.activeSlotNumber === review.review_slot ? "bg-primary text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} disabled={state.isLoading} data-api-unique-id="reviewsmanagementview-r939dd69ac47e1fe1-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView" data-api-in-loop="1">
                              <ChevronRight className="w-4 h-4" data-api-unique-id="reviewsmanagementview-radadfde4f0df7a17-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView" data-api-in-loop="1" />
                            </Button>
                          </TableCell>
                        </TableRow>)}
                    </TableBody>
                  </Table>}
              </Card>
            </div>

            {/* RIGHT PANE: Editor Panel */}
            <div className="lg:col-span-7" data-api-unique-id="reviewsmanagementview-r0d888bdb68e3d970-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
              {!state.activeSlotNumber ? <Card className="h-full min-h-[500px] border-dashed border-2 border-border/40 bg-muted/20 flex flex-col items-center justify-center p-12 text-center rounded-lg" data-api-unique-id="reviewsmanagementview-r4e78a457c4e93a75-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6" data-api-unique-id="reviewsmanagementview-r31dc978e0ef5aa3d-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                    <Edit3 className="w-10 h-10 text-muted-foreground/40" data-api-unique-id="reviewsmanagementview-rc02f545abf6e527b-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView" />
                  </div>
                  <h3 className="text-2xl font-display text-foreground mb-2" data-api-unique-id="reviewsmanagementview-rf275bef288c46cd7-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">Editorial Workstation</h3>
                  <p className="text-muted-foreground font-header italic max-w-sm" data-api-unique-id="reviewsmanagementview-r5219726651b346f8-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                    Select a slot from the registry to begin editing or crafting a new guest testimonial.
                  </p>
                </Card> : !state.activeReview ? <div className="h-[500px] flex items-center justify-center" data-api-unique-id="reviewsmanagementview-rf0c264cf19f31c2a-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                   <div className="animate-pulse flex flex-col items-center gap-4" data-api-unique-id="reviewsmanagementview-reb3f154fe06fedfc-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                      <div className="h-12 w-12 bg-muted rounded-full" data-api-unique-id="reviewsmanagementview-re32c588d6facbe95-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView" />
                      <div className="h-4 w-32 bg-muted rounded" data-api-unique-id="reviewsmanagementview-r852dc57a9d8d97df-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView" />
                   </div>
                </div> : <Card className="border-border rounded-lg shadow-md bg-card overflow-hidden" data-api-unique-id="reviewsmanagementview-r8634f9713d51aa8d-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                  <form onSubmit={handlers.handleSave} className="flex flex-col" data-api-unique-id="reviewsmanagementview-re1dbbcacc1d3cbeb-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                    {/* Editor Header */}
                    <div className="px-8 py-6 border-b border-border bg-muted/30 flex items-center justify-between" data-api-unique-id="reviewsmanagementview-rd4dda5a38a069003-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                      <div className="flex items-center gap-4" data-api-unique-id="reviewsmanagementview-r20ab9cfcc92693eb-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                        <div className="bg-primary text-primary-foreground text-2xl font-display w-12 h-12 flex items-center justify-center rounded-sm" data-api-unique-id="reviewsmanagementview-r2442532fe291a0f8-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                          0{state.activeReview.review_slot}
                        </div>
                        <div data-api-unique-id="reviewsmanagementview-r26d6599fc944a514-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                          <h2 className="text-xl font-header font-bold" data-api-unique-id="reviewsmanagementview-re3a494fe03947a58-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">Review Configuration</h2>
                          <div className="flex items-center gap-2 mt-1" data-api-unique-id="reviewsmanagementview-r2faae0599ef1daef-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                            {getStatusIcon(state.activeReview.match_status)}
                            <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium" data-api-unique-id="reviewsmanagementview-rd8560b458aa572da-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                              {state.MATCH_STATUS_LABELS[state.activeReview.match_status]}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {state.activeReview.is_present && state.activeReview.review_id && <Button type="button" variant="outline" size="sm" className="text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive/20 h-9 px-3 rounded-sm" disabled={state.isSaving} onClick={() => handlers.openDeleteConfirmation(state.activeReview!.review_id!, state.activeReview!.review_slot)} data-api-unique-id="reviewsmanagementview-r0de87a32061b35a6-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                          <Trash2 className="w-4 h-4 mr-2" data-api-unique-id="reviewsmanagementview-rba3d532ea2c44de2-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView" />
                          Purge Review
                        </Button>}
                    </div>

                    {/* Editor Body */}
                    <div className="p-8 space-y-6" data-api-unique-id="reviewsmanagementview-r79f743ae4e7203f3-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-api-unique-id="reviewsmanagementview-rc8e7c7dbf1bdc0d8-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                        <div className="space-y-2" data-api-unique-id="reviewsmanagementview-ref149c1b19eee8b8-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                          <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-1" data-api-unique-id="reviewsmanagementview-r55232c4d001e3018-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">Guest Name</Label>
                          <Input className="bg-background border-border/50 focus:ring-primary h-11 px-4 rounded-sm" value={state.formData.author_name} onChange={e => handlers.handleFormFieldChange('author_name', e.target.value)} placeholder="e.g. Giuseppe Verdi" disabled={state.isSaving} required data-api-unique-id="reviewsmanagementview-r1361f2c5a7f61f67-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView" />
                        </div>
                        <div className="space-y-2" data-api-unique-id="reviewsmanagementview-r867693bf8b88ccf8-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                          <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-1" data-api-unique-id="reviewsmanagementview-r2812c494ad24679d-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">Rating Experience</Label>
                          <div className="relative" data-api-unique-id="reviewsmanagementview-r0503f28d501af85a-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                            <Input type="number" min="1" max="5" className="bg-background border-border/50 focus:ring-primary h-11 px-4 rounded-sm" value={state.formData.rating} onChange={e => handlers.handleFormFieldChange('rating', e.target.value)} placeholder="1-5 Stars" disabled={state.isSaving} required data-api-unique-id="reviewsmanagementview-r7af133db18d39277-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView" />
                            <Star className="absolute right-3 top-3 w-5 h-5 text-primary/30 pointer-events-none" data-api-unique-id="reviewsmanagementview-r3fd1d77afceb82b7-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2" data-api-unique-id="reviewsmanagementview-rc74c3e0a27af281e-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                        <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-1" data-api-unique-id="reviewsmanagementview-r92286179444fdb6f-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">Chronological Context</Label>
                        <Input className="bg-background border-border/50 focus:ring-primary h-11 px-4 rounded-sm" value={state.formData.relative_time} onChange={e => handlers.handleFormFieldChange('relative_time', e.target.value)} placeholder="e.g. A crisp evening in late October" disabled={state.isSaving} required data-api-unique-id="reviewsmanagementview-rd941002a78983f34-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView" />
                      </div>

                      <div className="space-y-2" data-api-unique-id="reviewsmanagementview-rc87bcf71d2300f8d-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                        <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-1" data-api-unique-id="reviewsmanagementview-r7829306ac2abef98-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">Verbatim Content</Label>
                        <Textarea className="bg-background border-border/50 focus:ring-primary min-h-[180px] p-4 rounded-sm leading-relaxed resize-none" value={state.formData.content} onChange={e => handlers.handleFormFieldChange('content', e.target.value)} placeholder="Enter the guest's exact words..." disabled={state.isSaving} required data-api-unique-id="reviewsmanagementview-rd1ccc842c2f34d5e-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView" />
                        <p className="text-[10px] text-muted-foreground italic mt-1" data-api-unique-id="reviewsmanagementview-r583bdd8fdc2a8daf-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                          * Ensure the quote maintains editorial integrity and matches the guest's original intent.
                        </p>
                      </div>
                    </div>

                    {/* Editor Footer */}
                    <div className="px-8 py-6 bg-muted/10 border-t border-border flex items-center justify-end gap-3" data-api-unique-id="reviewsmanagementview-rb312eeb8c8b863e9-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                      <Button type="button" variant="ghost" className="hover:bg-muted font-medium h-11 px-6 rounded-sm" disabled={state.isSaving} onClick={handlers.handleClearSelection} data-api-unique-id="reviewsmanagementview-r21b779fbced4d22d-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                        Abandon Changes
                      </Button>
                      <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-11 px-8 rounded-sm shadow-sm transition-all active:scale-95" disabled={state.isSaving} data-api-unique-id="reviewsmanagementview-r3e6d62a853fc7bb9-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                        {state.isSaving ? <>
                            <div className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full mr-2" data-api-unique-id="reviewsmanagementview-r17c9144784ff2473-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView" />
                            Processing...
                          </> : state.activeReview.is_present ? <>
                            <Edit3 className="w-4 h-4 mr-2" data-api-unique-id="reviewsmanagementview-rc0214d9e2aab53f1-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView" />
                            Update Testimonial
                          </> : <>
                            <Plus className="w-4 h-4 mr-2" data-api-unique-id="reviewsmanagementview-r9643a02e25c1a95b-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView" />
                            Publish to Slot
                          </>}
                      </Button>
                    </div>
                  </form>
                </Card>}
            </div>
          </div>
        </div>
      </section>

      {/* DELETION CONFIRMATION DIALOG */}
      <Dialog open={state.deleteContext.isOpen} onOpenChange={open => !open && handlers.closeDeleteConfirmation()} data-api-unique-id="reviewsmanagementview-rbeafa3ca598deb77-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
        <DialogContent className="sm:max-w-[480px] border-border rounded-lg p-0 overflow-hidden shadow-md" data-api-unique-id="reviewsmanagementview-r17645508a90ee34e-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
          <div className="bg-destructive/10 p-6 flex flex-col items-center text-center" data-api-unique-id="reviewsmanagementview-rb1a055b7ef6adae8-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
            <div className="w-14 h-14 rounded-full bg-destructive/20 flex items-center justify-center mb-4" data-api-unique-id="reviewsmanagementview-r054f01f5f2fa9483-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
              <Trash2 className="w-8 h-8 text-destructive" data-api-unique-id="reviewsmanagementview-rce3e284101a6ef06-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView" />
            </div>
            <DialogHeader className="space-y-2" data-api-unique-id="reviewsmanagementview-r94932c42202a8cf5-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
              <DialogTitle className="text-2xl font-display text-foreground" data-api-unique-id="reviewsmanagementview-r48119dbf51b52572-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">Irreversible Action</DialogTitle>
              <DialogDescription className="text-muted-foreground font-header italic text-base" data-api-unique-id="reviewsmanagementview-r276c966ed8166d86-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                Confirm Review Deletion
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="px-8 py-6" data-api-unique-id="reviewsmanagementview-rb06e8934ee478c7c-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
            <p className="text-foreground text-sm leading-relaxed text-center mb-6" data-api-unique-id="reviewsmanagementview-r9408fc00edff9fa5-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
              You are about to remove this guest review from <span className="font-bold" data-api-unique-id="reviewsmanagementview-r227bf46b289cd991-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">Slot 0{state.deleteContext.slot}</span>. This will immediately affect the homepage presentation and reset the slot status to <span className="text-destructive font-bold underline" data-api-unique-id="reviewsmanagementview-r085c9e3bcbad2710-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">Missing</span>.
            </p>
            <div className="flex flex-col gap-3" data-api-unique-id="reviewsmanagementview-re232dd9c3b36a369-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
              <Button variant="destructive" className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 h-12 rounded-sm font-bold uppercase tracking-widest text-xs" onClick={handlers.confirmDelete} disabled={state.isDeleting} data-api-unique-id="reviewsmanagementview-rd6ee21fa681a4c7b-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                {state.isDeleting ? "Extinguishing Data..." : "Confirm Final Deletion"}
              </Button>
              <Button variant="outline" className="w-full h-12 rounded-sm border-border hover:bg-muted font-medium" onClick={handlers.closeDeleteConfirmation} disabled={state.isDeleting} data-api-unique-id="reviewsmanagementview-r194b039a4901a816-s2569049706" data-api-unique-page-name="src/backend/components/ReviewsManagementView">
                Retain Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>;
};