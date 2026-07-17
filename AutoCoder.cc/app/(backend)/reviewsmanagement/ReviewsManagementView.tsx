'use client'

import React from 'react'
import { 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  Trash2, 
  Edit3, 
  Plus, 
  ChevronRight,
  MessageSquare,
  Star
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { ReviewsManagementState, ReviewsManagementHandlers } from '@/backend/hooks/useReviewsManagement'

interface Props {
  state: ReviewsManagementState
  handlers: ReviewsManagementHandlers
}

export const ReviewsManagementView = ({ state, handlers }: Props) => {
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'MATCHED': return <CheckCircle2 className="w-4 h-4 text-primary" />
      case 'MISMATCHED': return <AlertCircle className="w-4 h-4 text-secondary" />
      default: return <HelpCircle className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    const label = state.MATCH_STATUS_LABELS[status as keyof typeof state.MATCH_STATUS_LABELS] || 'Unknown'
    switch (status) {
      case 'MATCHED': 
        return <Badge variant="outline" className="border-primary text-primary bg-primary/5 rounded-sm font-body px-2 py-0.5">{label}</Badge>
      case 'MISMATCHED': 
        return <Badge variant="outline" className="border-secondary text-secondary bg-secondary/5 rounded-sm font-body px-2 py-0.5">{label}</Badge>
      default: 
        return <Badge variant="outline" className="border-muted-foreground text-muted-foreground bg-muted/5 rounded-sm font-body px-2 py-0.5">{label}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      {/* HEADER SECTION */}
      <section data-controller-name="Reviews Dashboard Header" className="w-full border-b border-border bg-card">
        <div className="container mx-auto px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-4xl font-display tracking-tight text-foreground uppercase">
                Reviews Management
              </h1>
              <p className="text-muted-foreground font-header italic text-lg">
                Refining the guest experience through authentic feedback
              </p>
            </div>
            <div className="flex items-center gap-3 bg-muted px-4 py-2 rounded-sm border border-border/50">
              <div className="flex -space-x-1">
                {[...Array(state.totalSlots)].map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-3 h-3 rounded-full border border-card",
                      i < state.presentCount ? "bg-primary" : "bg-border/30"
                    )} 
                  />
                ))}
              </div>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Sync Status: <span className="text-foreground">{state.presentCount} / {state.totalSlots}</span> Slots Occupied
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <section data-controller-name="Reviews Management Layout" className="w-full">
        <div className="container mx-auto px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* LEFT PANE: Verification List */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-header font-bold text-foreground flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-secondary" />
                  Review Slot Registry
                </h2>
              </div>
              
              <Card className="rounded-lg overflow-hidden border-border bg-card shadow-xs">
                {state.isLoading ? (
                  <div className="p-20 text-center space-y-4">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                    <p className="text-muted-foreground font-header italic">Gathering records...</p>
                  </div>
                ) : state.reviews.length === 0 ? (
                  <div className="p-20 text-center">
                    <p className="text-muted-foreground font-header italic">No slot data available.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow className="hover:bg-transparent border-border">
                        <TableHead className="w-20 uppercase text-[10px] tracking-widest font-bold text-muted-foreground">Slot</TableHead>
                        <TableHead className="uppercase text-[10px] tracking-widest font-bold text-muted-foreground">Reviewer</TableHead>
                        <TableHead className="uppercase text-[10px] tracking-widest font-bold text-muted-foreground">Status</TableHead>
                        <TableHead className="text-right uppercase text-[10px] tracking-widest font-bold text-muted-foreground">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {state.reviews.map((review) => (
                        <TableRow 
                          key={review.review_slot} 
                          className={cn(
                            "group cursor-pointer transition-colors border-border/50",
                            state.activeSlotNumber === review.review_slot ? "bg-accent/20" : "hover:bg-muted/30"
                          )}
                          onClick={() => handlers.handleSelectSlot(review.review_slot)}
                        >
                          <TableCell className="font-header font-bold text-lg">
                            0{review.review_slot}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className={cn(
                                "font-medium text-sm truncate max-w-[120px]",
                                !review.author_name && "text-muted-foreground italic"
                              )}>
                                {review.author_name || 'Unassigned'}
                              </span>
                              {review.rating && (
                                <div className="flex items-center gap-1 mt-0.5">
                                  <Star className="w-3 h-3 fill-primary text-primary" />
                                  <span className="text-[10px] text-muted-foreground font-medium">{review.rating}.0</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(review.match_status)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className={cn(
                                "h-8 w-8 p-0 rounded-sm transition-all",
                                state.activeSlotNumber === review.review_slot ? "bg-primary text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
                              )}
                              disabled={state.isLoading}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Card>
            </div>

            {/* RIGHT PANE: Editor Panel */}
            <div className="lg:col-span-7">
              {!state.activeSlotNumber ? (
                <Card className="h-full min-h-[500px] border-dashed border-2 border-border/40 bg-muted/20 flex flex-col items-center justify-center p-12 text-center rounded-lg">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
                    <Edit3 className="w-10 h-10 text-muted-foreground/40" />
                  </div>
                  <h3 className="text-2xl font-display text-foreground mb-2">Editorial Workstation</h3>
                  <p className="text-muted-foreground font-header italic max-w-sm">
                    Select a slot from the registry to begin editing or crafting a new guest testimonial.
                  </p>
                </Card>
              ) : !state.activeReview ? (
                <div className="h-[500px] flex items-center justify-center">
                   <div className="animate-pulse flex flex-col items-center gap-4">
                      <div className="h-12 w-12 bg-muted rounded-full" />
                      <div className="h-4 w-32 bg-muted rounded" />
                   </div>
                </div>
              ) : (
                <Card className="border-border rounded-lg shadow-md bg-card overflow-hidden">
                  <form onSubmit={handlers.handleSave} className="flex flex-col">
                    {/* Editor Header */}
                    <div className="px-8 py-6 border-b border-border bg-muted/30 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary text-primary-foreground text-2xl font-display w-12 h-12 flex items-center justify-center rounded-sm">
                          0{state.activeReview.review_slot}
                        </div>
                        <div>
                          <h2 className="text-xl font-header font-bold">Review Configuration</h2>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusIcon(state.activeReview.match_status)}
                            <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                              {state.MATCH_STATUS_LABELS[state.activeReview.match_status]}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {state.activeReview.is_present && state.activeReview.review_id && (
                        <Button 
                          type="button" 
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive/20 h-9 px-3 rounded-sm"
                          disabled={state.isSaving}
                          onClick={() => handlers.openDeleteConfirmation(state.activeReview!.review_id!, state.activeReview!.review_slot)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Purge Review
                        </Button>
                      )}
                    </div>

                    {/* Editor Body */}
                    <div className="p-8 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-1">Guest Name</Label>
                          <Input 
                            className="bg-background border-border/50 focus:ring-primary h-11 px-4 rounded-sm"
                            value={state.formData.author_name} 
                            onChange={(e) => handlers.handleFormFieldChange('author_name', e.target.value)}
                            placeholder="e.g. Giuseppe Verdi"
                            disabled={state.isSaving}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-1">Rating Experience</Label>
                          <div className="relative">
                            <Input 
                              type="number"
                              min="1"
                              max="5"
                              className="bg-background border-border/50 focus:ring-primary h-11 px-4 rounded-sm"
                              value={state.formData.rating} 
                              onChange={(e) => handlers.handleFormFieldChange('rating', e.target.value)}
                              placeholder="1-5 Stars"
                              disabled={state.isSaving}
                              required
                            />
                            <Star className="absolute right-3 top-3 w-5 h-5 text-primary/30 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-1">Chronological Context</Label>
                        <Input 
                          className="bg-background border-border/50 focus:ring-primary h-11 px-4 rounded-sm"
                          value={state.formData.relative_time} 
                          onChange={(e) => handlers.handleFormFieldChange('relative_time', e.target.value)}
                          placeholder="e.g. A crisp evening in late October"
                          disabled={state.isSaving}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-1">Verbatim Content</Label>
                        <Textarea 
                          className="bg-background border-border/50 focus:ring-primary min-h-[180px] p-4 rounded-sm leading-relaxed resize-none"
                          value={state.formData.content} 
                          onChange={(e) => handlers.handleFormFieldChange('content', e.target.value)}
                          placeholder="Enter the guest's exact words..."
                          disabled={state.isSaving}
                          required
                        />
                        <p className="text-[10px] text-muted-foreground italic mt-1">
                          * Ensure the quote maintains editorial integrity and matches the guest's original intent.
                        </p>
                      </div>
                    </div>

                    {/* Editor Footer */}
                    <div className="px-8 py-6 bg-muted/10 border-t border-border flex items-center justify-end gap-3">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        className="hover:bg-muted font-medium h-11 px-6 rounded-sm"
                        disabled={state.isSaving}
                        onClick={handlers.handleClearSelection}
                      >
                        Abandon Changes
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-11 px-8 rounded-sm shadow-sm transition-all active:scale-95"
                        disabled={state.isSaving}
                      >
                        {state.isSaving ? (
                          <>
                            <div className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full mr-2" />
                            Processing...
                          </>
                        ) : state.activeReview.is_present ? (
                          <>
                            <Edit3 className="w-4 h-4 mr-2" />
                            Update Testimonial
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Publish to Slot
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* DELETION CONFIRMATION DIALOG */}
      <Dialog open={state.deleteContext.isOpen} onOpenChange={(open) => !open && handlers.closeDeleteConfirmation()}>
        <DialogContent className="sm:max-w-[480px] border-border rounded-lg p-0 overflow-hidden shadow-md">
          <div className="bg-destructive/10 p-6 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-destructive/20 flex items-center justify-center mb-4">
              <Trash2 className="w-8 h-8 text-destructive" />
            </div>
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-2xl font-display text-foreground">Irreversible Action</DialogTitle>
              <DialogDescription className="text-muted-foreground font-header italic text-base">
                Confirm Review Deletion
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="px-8 py-6">
            <p className="text-foreground text-sm leading-relaxed text-center mb-6">
              You are about to remove this guest review from <span className="font-bold">Slot 0{state.deleteContext.slot}</span>. This will immediately affect the homepage presentation and reset the slot status to <span className="text-destructive font-bold underline">Missing</span>.
            </p>
            <div className="flex flex-col gap-3">
              <Button 
                variant="destructive" 
                className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 h-12 rounded-sm font-bold uppercase tracking-widest text-xs"
                onClick={handlers.confirmDelete}
                disabled={state.isDeleting}
              >
                {state.isDeleting ? "Extinguishing Data..." : "Confirm Final Deletion"}
              </Button>
              <Button 
                variant="outline" 
                className="w-full h-12 rounded-sm border-border hover:bg-muted font-medium"
                onClick={handlers.closeDeleteConfirmation}
                disabled={state.isDeleting}
              >
                Retain Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
