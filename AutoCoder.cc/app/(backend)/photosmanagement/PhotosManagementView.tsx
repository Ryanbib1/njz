'use client'

import React from 'react'
import { 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Edit3, 
  Plus, 
  Image as ImageIcon,
  Loader2,
  Info
} from 'lucide-react'
import type { 
  RecordStatus, 
  MatchStatus
} from '@/backend/actions/PhotosManagement'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter,
  SheetDescription
} from "@/components/ui/sheet"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import EditableImg from '@/@base/EditableImg'
import type { PhotosManagementState, PhotosManagementHandlers } from '@/backend/hooks/usePhotosManagement'

// ===== Enum Mappings (en-US) =====
const RECORD_STATUS_LABELS: Record<RecordStatus, string> = {
  PRESENT: 'Present',
  MISSING: 'Missing',
}

const MATCH_STATUS_LABELS: Record<MatchStatus, string> = {
  MATCHED: 'Matched',
  MISMATCHED: 'Mismatched',
}

interface Props {
  state: PhotosManagementState
  handlers: PhotosManagementHandlers
}

export const PhotosManagementView = ({ state, handlers }: Props) => {
  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      {/* 1. Page Masthead */}
      <section className="w-full border-b border-border bg-card" data-controller-name="Page Masthead">
        <div className="container mx-auto px-8 py-10">
          <h1 className="font-header text-5xl font-medium tracking-tight mb-3">Photos Management</h1>
          <p className="text-muted-foreground text-lg max-w-2xl font-light">
            Editorial control for the homepage gallery. Manage the fixed 10-slot layout to ensure architectural visual consistency.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-8 py-8 space-y-8">
        
        {/* 2. Reference Summary Board */}
        <section data-controller-name="Reference Summary Board">
          <Card className="rounded-none border-border shadow-xs overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
              <div className="p-6">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Total Slots</p>
                <p className="text-3xl font-header font-semibold text-secondary">{state.listData?.totalSlots || 0}</p>
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Record Status</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-header font-semibold text-foreground">{state.listData?.presentCount || 0}</span>
                  <span className="text-sm text-muted-foreground">Present</span>
                  <span className="mx-1 text-border">/</span>
                  <span className="text-xl font-header text-muted-foreground">{state.listData?.missingCount || 0}</span>
                  <span className="text-xs text-muted-foreground">Missing</span>
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Match Status</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-header font-semibold text-primary">{state.listData?.matchedCount || 0}</span>
                  <span className="text-sm text-muted-foreground">Matched</span>
                </div>
              </div>
              <div className="p-6 bg-muted/30">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Slot Visualizer</p>
                <div className="flex gap-1.5 flex-wrap">
                  {state.listData?.items.map((item) => (
                    <div 
                      key={item.photoKey}
                      className={`h-6 w-6 flex items-center justify-center text-[10px] font-bold border transition-colors ${
                        item.recordStatus === 'PRESENT' 
                        ? 'bg-secondary text-secondary-foreground border-secondary' 
                        : 'bg-transparent text-muted-foreground border-border dashed'
                      }`}
                      title={`${item.photoKey}: ${item.recordStatus}`}
                    >
                      {item.photoKey.split('_')[1]}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* 3. Photos Verification Index */}
        <section data-controller-name="Photos Verification Index">
          {state.isLoadingList && !state.listData ? (
            <div className="flex flex-col items-center justify-center py-24 border border-dashed border-border">
              <Loader2 className="h-10 w-10 animate-spin text-secondary mb-4" />
              <p className="font-header text-xl italic text-muted-foreground">Curating your gallery data...</p>
            </div>
          ) : !state.listData ? (
            <Alert className="rounded-none border-destructive bg-destructive/5 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Failed to synchronize with the gallery database. Please refresh the dashboard.</AlertDescription>
            </Alert>
          ) : (
            <div className="bg-card border border-border shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="w-[140px] uppercase text-[10px] tracking-widest font-bold px-6">Slot Identity</TableHead>
                    <TableHead className="w-[180px] uppercase text-[10px] tracking-widest font-bold">Image Preview</TableHead>
                    <TableHead className="uppercase text-[10px] tracking-widest font-bold">Asset Metadata</TableHead>
                    <TableHead className="uppercase text-[10px] tracking-widest font-bold">Source</TableHead>
                    <TableHead className="w-[140px] uppercase text-[10px] tracking-widest font-bold">Status</TableHead>
                    <TableHead className="w-[160px] uppercase text-[10px] tracking-widest font-bold text-right px-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state.listData.items.map((item) => (
                    <TableRow key={item.photoKey} className="border-border hover:bg-muted/20 transition-colors">
                      <TableCell className="px-6 py-5 align-top">
                        <p className="font-bold text-foreground text-sm leading-none mb-1">{item.photoKey}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Sequence: {item.sortOrder}</p>
                      </TableCell>
                      <TableCell className="py-5 align-top">
                        <div className="relative aspect-[4/3] w-32 border border-border overflow-hidden bg-muted group">
                          {item.recordStatus === 'PRESENT' && item.imageUrl ? (
                            <EditableImg 
                              propKey={`preview_${item.photoKey}`}
                              keywords={item.imageUrl}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center opacity-40 grayscale">
                              <ImageIcon className="h-6 w-6 mb-1" />
                              <span className="text-[9px] uppercase tracking-tighter">Empty Slot</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-5 align-top max-w-md">
                        {item.recordStatus === 'PRESENT' ? (
                          <div className="space-y-2">
                            <div>
                              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">Alt Text</p>
                              <p className="text-sm line-clamp-1 italic">"{item.alt}"</p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">Description</p>
                              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{item.description}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground/30">—</span>
                        )}
                      </TableCell>
                      <TableCell className="py-5 align-top">
                        {item.imageUrl ? (
                          <div className="max-w-[150px]">
                             <p className="text-[10px] font-mono text-muted-foreground break-all truncate" title={item.imageUrl}>
                              {item.imageUrl}
                            </p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground/30">—</span>
                        )}
                      </TableCell>
                      <TableCell className="py-5 align-top">
                        <div className="space-y-1.5">
                          <Badge 
                            variant="secondary" 
                            className={`rounded-none font-bold uppercase text-[9px] px-2 py-0.5 ${
                              item.recordStatus === 'PRESENT' 
                              ? 'bg-secondary text-secondary-foreground' 
                              : 'bg-muted text-muted-foreground border-dashed border-border'
                            }`}
                          >
                            {RECORD_STATUS_LABELS[item.recordStatus]}
                          </Badge>
                          {item.matchStatus && (
                            <Badge 
                              className={`block w-fit rounded-none font-bold uppercase text-[9px] px-2 py-0.5 ${
                                item.matchStatus === 'MATCHED' 
                                ? 'bg-accent/20 text-accent-foreground border border-accent/40' 
                                : 'bg-destructive text-destructive-foreground'
                              }`}
                            >
                              {MATCH_STATUS_LABELS[item.matchStatus]}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-5 align-top text-right">
                        <div className="flex justify-end gap-2">
                          {item.recordStatus === 'PRESENT' && item.id ? (
                            <>
                              <Button 
                                variant="secondary" 
                                size="sm" 
                                className="h-8 rounded-none border-border hover:bg-secondary hover:text-secondary-foreground"
                                onClick={() => handlers.handleOpenEdit(item.id!)}
                              >
                                <Edit3 className="h-3.5 w-3.5 mr-1.5" />
                                Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 rounded-none border-border text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => handlers.handleOpenDelete(item.id!)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </>
                          ) : (
                            <Button 
                              size="sm" 
                              className="h-8 rounded-none bg-primary text-primary-foreground hover:bg-primary/90"
                              onClick={() => handlers.handleOpenCreate(item.photoKey)}
                            >
                              <Plus className="h-3.5 w-3.5 mr-1.5" />
                              Initialize
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </section>
      </div>

      {/* 4. Photo Detail Editor (Contextual Overlay Panel) */}
      <Sheet open={!!state.activeItemInfo && !state.deleteTargetId} onOpenChange={(open) => !open && handlers.handleClosePanel()}>
        <SheetContent className="w-full sm:max-w-xl bg-card border-l border-border rounded-none p-0 flex flex-col shadow-md">
          <SheetHeader className="px-8 pt-8 pb-6 border-b border-border">
            <SheetTitle className="font-header text-3xl">
              {state.activeItemInfo?.mode === 'create' ? `Initialize: ${state.activeItemInfo?.item?.photoKey}` : `Modify: ${state.activeItemInfo?.item?.photoKey}`}
            </SheetTitle>
            <SheetDescription className="text-muted-foreground italic">
              Define the visual and metadata architecture for this gallery slot.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-auto px-8 py-8 space-y-10">
            {state.isEditorLoading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-secondary mb-4" />
                <p className="font-header text-lg italic text-muted-foreground">Fetching details...</p>
              </div>
            ) : (
              <>
                <div data-controller-name="Visual Proofing Area" className="space-y-3">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Visual Proofing</p>
                  <div className="aspect-video w-full bg-muted border border-border flex items-center justify-center overflow-hidden relative shadow-inner">
                    {state.formData.imageUrl ? (
                      <EditableImg 
                        propKey="editor_preview"
                        keywords={state.formData.imageUrl}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center opacity-30">
                        <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-xs uppercase tracking-tighter">No Preview Available</p>
                      </div>
                    )}
                  </div>
                </div>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-bold">Slot Assignment</Label>
                      <Input 
                        value={state.activeItemInfo?.item?.photoKey || ''} 
                        disabled 
                        className="bg-muted border-border font-mono text-xs rounded-sm px-3 py-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest font-bold">Sequence</Label>
                      <Input 
                        value={state.activeItemInfo?.item?.sortOrder?.toString() || ''} 
                        disabled 
                        className="bg-muted border-border font-mono text-xs rounded-sm px-3 py-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest font-bold">Image Source URL</Label>
                    <Input 
                      value={state.formData.imageUrl} 
                      onChange={(e) => handlers.handleFormFieldChange('imageUrl', e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="border-border rounded-sm px-3 py-2 focus:ring-primary h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest font-bold">Alt Text (Accessibility)</Label>
                    <Input 
                      value={state.formData.alt} 
                      onChange={(e) => handlers.handleFormFieldChange('alt', e.target.value)}
                      placeholder="e.g. Italian Pasta dish on ceramic plate"
                      className="border-border rounded-sm px-3 py-2 focus:ring-primary h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest font-bold">Description Caption</Label>
                    <Textarea 
                      value={state.formData.description} 
                      onChange={(e) => handlers.handleFormFieldChange('description', e.target.value)}
                      placeholder="Provide a brief narrative or culinary description..."
                      className="border-border rounded-sm px-3 py-2 focus:ring-primary min-h-[100px] leading-relaxed"
                    />
                  </div>
                </form>

                {!state.isFormValid && (
                  <Alert variant="destructive" className="rounded-none border-destructive bg-destructive/5 text-destructive p-4">
                    <div className="flex gap-3">
                      <Info className="h-4 w-4 shrink-0" />
                      <AlertDescription className="text-xs font-medium leading-normal">
                        Operational Integrity Warning: All structural fields (URL, Alt Text, Description) must be defined before publishing to the gallery.
                      </AlertDescription>
                    </div>
                  </Alert>
                )}
              </>
            )}
          </div>

          <SheetFooter className="px-8 py-6 border-t border-border bg-muted/20 gap-3">
            <Button 
              variant="outline" 
              className="flex-1 rounded-sm border-border hover:bg-muted hover:text-foreground h-11"
              onClick={handlers.handleClosePanel} 
              disabled={state.isEditorSaving}
            >
              Discard Changes
            </Button>
            <Button 
              className="flex-[2] rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 h-11"
              onClick={handlers.handleSavePhoto} 
              disabled={!state.isFormValid || state.isEditorSaving || state.isEditorLoading}
            >
              {state.isEditorSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                'Save Configuration'
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* 5. Deletion Confirmation Modal */}
      <Dialog open={!!state.deleteTargetId} onOpenChange={(open) => !open && handlers.handleCloseDelete()}>
        <DialogContent className="rounded-none border-border max-w-md p-0 overflow-hidden shadow-md">
          <div className="p-8 pb-4">
            <DialogHeader className="space-y-4">
              <div className="h-12 w-12 rounded-none bg-destructive/10 flex items-center justify-center text-destructive">
                <Trash2 className="h-6 w-6" />
              </div>
              <DialogTitle className="font-header text-2xl">Confirm Destructive Action</DialogTitle>
              <DialogDescription className="text-muted-foreground leading-relaxed">
                Warning: Removing this record will transition the slot <span className="font-bold text-foreground">"{state.deleteTargetId}"</span> to a <span className="font-bold text-foreground italic">MISSING</span> state. 
                The associated asset will be immediately purged from the homepage gallery.
              </DialogDescription>
            </DialogHeader>
          </div>
          <DialogFooter className="bg-muted/30 p-8 pt-4 flex gap-3 sm:justify-end">
            <Button 
              variant="outline" 
              className="rounded-sm border-border hover:bg-muted h-10 px-6"
              onClick={handlers.handleCloseDelete} 
              disabled={state.isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              className="rounded-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-6 font-bold"
              onClick={handlers.handleConfirmDelete} 
              disabled={state.isDeleting}
            >
              {state.isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Confirm Deletion'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
