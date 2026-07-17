'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Trash2, Edit3, Plus, Image as ImageIcon, Loader2, Info } from 'lucide-react';
import type { RecordStatus, MatchStatus } from '@/backend/actions/PhotosManagement';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import EditableImg from '@/@base/EditableImg';
import type { PhotosManagementState, PhotosManagementHandlers } from '@/backend/hooks/usePhotosManagement';

// ===== Enum Mappings (en-US) =====
const RECORD_STATUS_LABELS: Record<RecordStatus, string> = {
  PRESENT: 'Present',
  MISSING: 'Missing'
};
const MATCH_STATUS_LABELS: Record<MatchStatus, string> = {
  MATCHED: 'Matched',
  MISMATCHED: 'Mismatched'
};
interface Props {
  state: PhotosManagementState;
  handlers: PhotosManagementHandlers;
}
export const PhotosManagementView = ({
  state,
  handlers
}: Props) => {
  return <div className="min-h-screen bg-background font-body text-foreground" data-api-unique-id="photosmanagementview-r14fae99cc216376c-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
      {/* 1. Page Masthead */}
      <section className="w-full border-b border-border bg-card" data-controller-name="Page Masthead" data-api-unique-id="photosmanagementview-rfcfd5ce81b5ff582-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
        <div className="container mx-auto px-8 py-10" data-api-unique-id="photosmanagementview-re8fca4fa6f283b98-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
          <h1 className="font-header text-5xl font-medium tracking-tight mb-3" data-api-unique-id="photosmanagementview-re339ed3b66c0efcb-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">Photos Management</h1>
          <p className="text-muted-foreground text-lg max-w-2xl font-light" data-api-unique-id="photosmanagementview-r51e8dc16985c4d54-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
            Editorial control for the homepage gallery. Manage the fixed 10-slot layout to ensure architectural visual consistency.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-8 py-8 space-y-8" data-api-unique-id="photosmanagementview-ra7a32261d56662d8-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
        
        {/* 2. Reference Summary Board */}
        <section data-controller-name="Reference Summary Board" data-api-unique-id="photosmanagementview-raab95622dbf1b5a6-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
          <Card className="rounded-none border-border shadow-xs overflow-hidden" data-api-unique-id="photosmanagementview-r8a9d9fe85406c6a8-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border" data-api-unique-id="photosmanagementview-r7466173c2eda446b-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
              <div className="p-6" data-api-unique-id="photosmanagementview-rc7f8a9e77972fa6e-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1" data-api-unique-id="photosmanagementview-rc20b81c2375b927b-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">Total Slots</p>
                <p className="text-3xl font-header font-semibold text-secondary" data-api-unique-id="photosmanagementview-rd0fabf87fc0ed069-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">{state.listData?.totalSlots || 0}</p>
              </div>
              <div className="p-6" data-api-unique-id="photosmanagementview-ra4de19bf968c0354-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1" data-api-unique-id="photosmanagementview-r4533dad2c2f59e48-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">Record Status</p>
                <div className="flex items-baseline gap-2" data-api-unique-id="photosmanagementview-r9bd517e5c49ed9f6-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
                  <span className="text-3xl font-header font-semibold text-foreground" data-api-unique-id="photosmanagementview-r2cf88e097aaa663f-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">{state.listData?.presentCount || 0}</span>
                  <span className="text-sm text-muted-foreground" data-api-unique-id="photosmanagementview-rf4e7575c2363199a-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">Present</span>
                  <span className="mx-1 text-border" data-api-unique-id="photosmanagementview-r627cb7192b401268-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">/</span>
                  <span className="text-xl font-header text-muted-foreground" data-api-unique-id="photosmanagementview-r8f9864616ae4e505-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">{state.listData?.missingCount || 0}</span>
                  <span className="text-xs text-muted-foreground" data-api-unique-id="photosmanagementview-rc20117c2ea645982-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">Missing</span>
                </div>
              </div>
              <div className="p-6" data-api-unique-id="photosmanagementview-rc95c992e685c7ab7-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1" data-api-unique-id="photosmanagementview-r2cd35bb6752af60f-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">Match Status</p>
                <div className="flex items-baseline gap-2" data-api-unique-id="photosmanagementview-r3bd532c0c3234419-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
                  <span className="text-3xl font-header font-semibold text-primary" data-api-unique-id="photosmanagementview-r539bbfe6fa7e1af2-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">{state.listData?.matchedCount || 0}</span>
                  <span className="text-sm text-muted-foreground" data-api-unique-id="photosmanagementview-rc82764ebb9d5d182-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">Matched</span>
                </div>
              </div>
              <div className="p-6 bg-muted/30" data-api-unique-id="photosmanagementview-rd497040f366647bd-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2" data-api-unique-id="photosmanagementview-rdb8bfad474178c48-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">Slot Visualizer</p>
                <div className="flex gap-1.5 flex-wrap" data-api-unique-id="photosmanagementview-re5bea795721cec78-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
                  {state.listData?.items.map(item => <div key={item.photoKey} className={`h-6 w-6 flex items-center justify-center text-[10px] font-bold border transition-colors ${item.recordStatus === 'PRESENT' ? 'bg-secondary text-secondary-foreground border-secondary' : 'bg-transparent text-muted-foreground border-border dashed'}`} title={`${item.photoKey}: ${item.recordStatus}`} data-api-unique-id="photosmanagementview-r91318c2da1f5ba89-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
                      {item.photoKey.split('_')[1]}
                    </div>)}
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* 3. Photos Verification Index */}
        <section data-controller-name="Photos Verification Index" data-api-unique-id="photosmanagementview-r223a6cf52b221eaf-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
          {state.isLoadingList && !state.listData ? <div className="flex flex-col items-center justify-center py-24 border border-dashed border-border" data-api-unique-id="photosmanagementview-rb13af1061b4439ad-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
              <Loader2 className="h-10 w-10 animate-spin text-secondary mb-4" data-api-unique-id="photosmanagementview-r9e9eca9b73b65deb-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" />
              <p className="font-header text-xl italic text-muted-foreground" data-api-unique-id="photosmanagementview-r22da0b2bbc2d37f3-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">Curating your gallery data...</p>
            </div> : !state.listData ? <Alert className="rounded-none border-destructive bg-destructive/5 text-destructive" data-api-unique-id="photosmanagementview-r42af3aca0685943e-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
              <AlertCircle className="h-4 w-4" data-api-unique-id="photosmanagementview-rf6d425c4ad87c336-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" />
              <AlertDescription data-api-unique-id="photosmanagementview-r7f2449c2e0e35ecb-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">Failed to synchronize with the gallery database. Please refresh the dashboard.</AlertDescription>
            </Alert> : <div className="bg-card border border-border shadow-sm overflow-hidden" data-api-unique-id="photosmanagementview-r7e67cd4414025ae3-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
              <Table data-api-unique-id="photosmanagementview-r9e820f2f5b7fc326-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
                <TableHeader className="bg-muted/50" data-api-unique-id="photosmanagementview-r0c51cdcfe0c429ee-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
                  <TableRow className="border-border hover:bg-transparent" data-api-unique-id="photosmanagementview-r9e3591029a7bfcf9-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
                    <TableHead className="w-[140px] uppercase text-[10px] tracking-widest font-bold px-6" data-api-unique-id="photosmanagementview-r8337723b13b7c0c7-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">Slot Identity</TableHead>
                    <TableHead className="w-[180px] uppercase text-[10px] tracking-widest font-bold" data-api-unique-id="photosmanagementview-r865d34bae2e1f567-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">Image Preview</TableHead>
                    <TableHead className="uppercase text-[10px] tracking-widest font-bold" data-api-unique-id="photosmanagementview-r6e6d81883626d54f-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">Asset Metadata</TableHead>
                    <TableHead className="uppercase text-[10px] tracking-widest font-bold" data-api-unique-id="photosmanagementview-rb48828a976c5ec4c-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">Source</TableHead>
                    <TableHead className="w-[140px] uppercase text-[10px] tracking-widest font-bold" data-api-unique-id="photosmanagementview-rf3ae3731ce95b26f-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">Status</TableHead>
                    <TableHead className="w-[160px] uppercase text-[10px] tracking-widest font-bold text-right px-6" data-api-unique-id="photosmanagementview-r3dc2ec847746d76e-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody data-api-unique-id="photosmanagementview-r76e09be7d3465b35-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
                  {state.listData.items.map((item, index) => <TableRow key={item.photoKey} className="border-border hover:bg-muted/20 transition-colors" data-api-unique-id="photosmanagementview-r0bac7563f85e0f58-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" data-api-in-loop="1">
                      <TableCell className="px-6 py-5 align-top" data-api-unique-id="photosmanagementview-rf919851fc78b1a76-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" data-api-in-loop="1">
                        <p className="font-bold text-foreground text-sm leading-none mb-1" data-api-unique-id="photosmanagementview-r1c98b8ddfdfd5359-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" data-api-in-loop="1">{item.photoKey}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider" data-api-unique-id="photosmanagementview-ra1d6d50eef21468c-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" data-api-in-loop="1">Sequence: {item.sortOrder}</p>
                      </TableCell>
                      <TableCell className="py-5 align-top" data-api-unique-id="photosmanagementview-r71efe76d2e1f225b-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" data-api-in-loop="1">
                        <div className="relative aspect-[4/3] w-32 border border-border overflow-hidden bg-muted group" data-api-unique-id="photosmanagementview-r5de2a98badb5b23c-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" data-api-in-loop="1">
                          {item.recordStatus === 'PRESENT' && item.imageUrl ? <EditableImg propKey={`preview_${item.photoKey}`} keywords={item.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" data-api-unique-id="photosmanagementview-rb8e0ad1f19457468-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" data-api-in-loop="1" /> : <div className="w-full h-full flex flex-col items-center justify-center opacity-40 grayscale" data-api-unique-id="photosmanagementview-r1bd1bff3f1fbfd7d-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" data-api-in-loop="1">
                              <ImageIcon className="h-6 w-6 mb-1" data-api-unique-id="photosmanagementview-r2b3c13c75475ddd5-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" data-api-in-loop="1" />
                              <span className="text-[9px] uppercase tracking-tighter" data-api-unique-id="photosmanagementview-r8b2b70ec91777a4f-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" data-api-in-loop="1">Empty Slot</span>
                            </div>}
                        </div>
                      </TableCell>
                      <TableCell className="py-5 align-top max-w-md" data-api-unique-id="photosmanagementview-r5100b1cf12d30b84-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" data-api-in-loop="1">
                        {item.recordStatus === 'PRESENT' ? <div className="space-y-2" data-api-unique-id="photosmanagementview-r621212dce6a1fe4e-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" data-api-in-loop="1">
                            <div data-api-unique-id="photosmanagementview-r61251cc5affad56b-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" data-api-in-loop="1">
                              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5" data-api-unique-id="photosmanagementview-r4ed4bc204ac4f7ac-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" data-api-in-loop="1">Alt Text</p>
                              <p className="text-sm line-clamp-1 italic" data-api-unique-id="photosmanagementview-r84232d18d98da7d9-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" data-api-in-loop="1">"{item.alt}"</p>
                            </div>
                            <div data-api-unique-id="photosmanagementview-rf26e01eeb4b91846-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" data-api-in-loop="1">
                              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5" data-api-unique-id="photosmanagementview-radfdad460c062f3d-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" data-api-in-loop="1">Description</p>
                              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2" data-api-unique-id="photosmanagementview-r8d0abb8103f26527-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" data-api-in-loop="1">{item.description}</p>
                            </div>
                          </div> : <span className="text-muted-foreground/30" data-api-unique-id="photosmanagementview-r289d947160f62672-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" data-api-in-loop="1">—</span>}
                      </TableCell>
                      <TableCell className="py-5 align-top" data-api-unique-id="photosmanagementview-recbe0931f35e3c44-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" data-api-in-loop="1">
                        {item.imageUrl ? <div className="max-w-[150px]" data-api-unique-id="photosmanagementview-r1c15660b7f03c3e0-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" data-api-in-loop="1">
                             <p className="text-[10px] font-mono text-muted-foreground break-all truncate" title={item.imageUrl} data-api-unique-id="photosmanagementview-r16b9933cf82ea047-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" data-api-in-loop="1">
                              {item.imageUrl}
                            </p>
                          </div> : <span className="text-muted-foreground/30" data-api-unique-id="photosmanagementview-rb5c88a6341f945b9-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" data-api-in-loop="1">—</span>}
                      </TableCell>
                      <TableCell className="py-5 align-top" data-api-unique-id="photosmanagementview-rcfa93bedc2827824-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" data-api-in-loop="1">
                        <div className="space-y-1.5" data-api-unique-id="photosmanagementview-rf55d58ad8aa95b86-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" data-api-in-loop="1">
                          <Badge variant="secondary" className={`rounded-none font-bold uppercase text-[9px] px-2 py-0.5 ${item.recordStatus === 'PRESENT' ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground border-dashed border-border'}`} data-api-unique-id="photosmanagementview-r245de3bb4371cb65-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" data-api-in-loop="1">
                            {RECORD_STATUS_LABELS[item.recordStatus]}
                          </Badge>
                          {item.matchStatus && <Badge className={`block w-fit rounded-none font-bold uppercase text-[9px] px-2 py-0.5 ${item.matchStatus === 'MATCHED' ? 'bg-accent/20 text-accent-foreground border border-accent/40' : 'bg-destructive text-destructive-foreground'}`} data-api-unique-id="photosmanagementview-rc6f08a9f4c33ee04-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" data-api-in-loop="1">
                              {MATCH_STATUS_LABELS[item.matchStatus]}
                            </Badge>}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-5 align-top text-right" data-api-unique-id="photosmanagementview-r9dfe5c0a65648c83-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" data-api-in-loop="1">
                        <div className="flex justify-end gap-2" data-api-unique-id="photosmanagementview-r5af0fde131994eb2-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" data-api-in-loop="1">
                          {item.recordStatus === 'PRESENT' && item.id ? <>
                              <Button variant="secondary" size="sm" className="h-8 rounded-none border-border hover:bg-secondary hover:text-secondary-foreground" onClick={() => handlers.handleOpenEdit(item.id!)} data-api-unique-id="photosmanagementview-re3cd98f1eb1e7b73-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" data-api-in-loop="1">
                                <Edit3 className="h-3.5 w-3.5 mr-1.5" data-api-unique-id="photosmanagementview-r124ac407569b190c-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" data-api-in-loop="1" />
                                Edit
                              </Button>
                              <Button variant="outline" size="sm" className="h-8 rounded-none border-border text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => handlers.handleOpenDelete(item.id!)} data-api-unique-id="photosmanagementview-r45b3d1053a9c0cdf-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" data-api-in-loop="1">
                                <Trash2 className="h-3.5 w-3.5" data-api-unique-id="photosmanagementview-rfbaba093a258b6a1-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" data-api-in-loop="1" />
                              </Button>
                            </> : <Button size="sm" className="h-8 rounded-none bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => handlers.handleOpenCreate(item.photoKey)} data-api-unique-id="photosmanagementview-r18ad688e8eb25eb7-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" data-api-in-loop="1">
                              <Plus className="h-3.5 w-3.5 mr-1.5" data-api-unique-id="photosmanagementview-r47f0457d7fe91b11-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" data-api-in-loop="1" />
                              Initialize
                            </Button>}
                        </div>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </div>}
        </section>
      </div>

      {/* 4. Photo Detail Editor (Contextual Overlay Panel) */}
      <Sheet open={!!state.activeItemInfo && !state.deleteTargetId} onOpenChange={open => !open && handlers.handleClosePanel()} data-api-unique-id="photosmanagementview-r2b5b94870962edc9-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
        <SheetContent className="w-full sm:max-w-xl bg-card border-l border-border rounded-none p-0 flex flex-col shadow-md" data-api-unique-id="photosmanagementview-rf741b2c1d40eddad-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
          <SheetHeader className="px-8 pt-8 pb-6 border-b border-border" data-api-unique-id="photosmanagementview-r8dbabd50ec7e1e1a-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
            <SheetTitle className="font-header text-3xl" data-api-unique-id="photosmanagementview-raf8bfbda6d808caa-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
              {state.activeItemInfo?.mode === 'create' ? `Initialize: ${state.activeItemInfo?.item?.photoKey}` : `Modify: ${state.activeItemInfo?.item?.photoKey}`}
            </SheetTitle>
            <SheetDescription className="text-muted-foreground italic" data-api-unique-id="photosmanagementview-rcb97282e25e31097-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
              Define the visual and metadata architecture for this gallery slot.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-auto px-8 py-8 space-y-10" data-api-unique-id="photosmanagementview-r6bd47dcbf2949467-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
            {state.isEditorLoading ? <div className="flex flex-col items-center justify-center h-full" data-api-unique-id="photosmanagementview-rd0cf3e2b8d012367-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
                <Loader2 className="h-8 w-8 animate-spin text-secondary mb-4" data-api-unique-id="photosmanagementview-rffe7a2263bf09d9d-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" />
                <p className="font-header text-lg italic text-muted-foreground" data-api-unique-id="photosmanagementview-radf7a47953e1d212-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">Fetching details...</p>
              </div> : <>
                <div data-controller-name="Visual Proofing Area" className="space-y-3" data-api-unique-id="photosmanagementview-rc988c6b536b576be-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground" data-api-unique-id="photosmanagementview-rc3e3b090660acdf3-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">Visual Proofing</p>
                  <div className="aspect-video w-full bg-muted border border-border flex items-center justify-center overflow-hidden relative shadow-inner" data-api-unique-id="photosmanagementview-r534f543c26c481e2-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
                    {state.formData.imageUrl ? <EditableImg propKey="editor_preview" keywords={state.formData.imageUrl} className="w-full h-full object-cover" data-api-unique-id="photosmanagementview-r5661ece1d2550e4a-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" /> : <div className="text-center opacity-30" data-api-unique-id="photosmanagementview-r63b82a4873d7ca0d-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
                        <ImageIcon className="h-12 w-12 mx-auto mb-2" data-api-unique-id="photosmanagementview-r3e27e33951130d3f-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" />
                        <p className="text-xs uppercase tracking-tighter" data-api-unique-id="photosmanagementview-r36e104b39e89ca65-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">No Preview Available</p>
                      </div>}
                  </div>
                </div>

                <form className="space-y-6" onSubmit={e => e.preventDefault()} data-api-unique-id="photosmanagementview-r98df3a915e18f8fd-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
                  <div className="grid grid-cols-2 gap-4" data-api-unique-id="photosmanagementview-rfec787c1b6c637a0-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
                    <div className="space-y-2" data-api-unique-id="photosmanagementview-r226dad8b25bd0432-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
                      <Label className="text-[10px] uppercase tracking-widest font-bold" data-api-unique-id="photosmanagementview-rb17bf0cb15b58d83-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">Slot Assignment</Label>
                      <Input value={state.activeItemInfo?.item?.photoKey || ''} disabled className="bg-muted border-border font-mono text-xs rounded-sm px-3 py-2" data-api-unique-id="photosmanagementview-r0072ceba9c2422dc-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" />
                    </div>
                    <div className="space-y-2" data-api-unique-id="photosmanagementview-rc2d54587e9ef121d-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
                      <Label className="text-[10px] uppercase tracking-widest font-bold" data-api-unique-id="photosmanagementview-r350fb0d865136bbc-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">Sequence</Label>
                      <Input value={state.activeItemInfo?.item?.sortOrder?.toString() || ''} disabled className="bg-muted border-border font-mono text-xs rounded-sm px-3 py-2" data-api-unique-id="photosmanagementview-rb80666ab2342dcc2-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" />
                    </div>
                  </div>

                  <div className="space-y-2" data-api-unique-id="photosmanagementview-rb8f6733865f0944b-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
                    <Label className="text-[10px] uppercase tracking-widest font-bold" data-api-unique-id="photosmanagementview-r4b1aaef963419fa6-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">Image Source URL</Label>
                    <Input value={state.formData.imageUrl} onChange={e => handlers.handleFormFieldChange('imageUrl', e.target.value)} placeholder="https://images.unsplash.com/..." className="border-border rounded-sm px-3 py-2 focus:ring-primary h-10" data-api-unique-id="photosmanagementview-r67b6b1795b56971a-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" />
                  </div>

                  <div className="space-y-2" data-api-unique-id="photosmanagementview-r99a0176c3ca53c73-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
                    <Label className="text-[10px] uppercase tracking-widest font-bold" data-api-unique-id="photosmanagementview-re0aa74db84fb3a03-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">Alt Text (Accessibility)</Label>
                    <Input value={state.formData.alt} onChange={e => handlers.handleFormFieldChange('alt', e.target.value)} placeholder="e.g. Italian Pasta dish on ceramic plate" className="border-border rounded-sm px-3 py-2 focus:ring-primary h-10" data-api-unique-id="photosmanagementview-r9315c5e06b149fdb-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" />
                  </div>

                  <div className="space-y-2" data-api-unique-id="photosmanagementview-rc58d4edaa1f049f4-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
                    <Label className="text-[10px] uppercase tracking-widest font-bold" data-api-unique-id="photosmanagementview-r05ca2400e8dc47d2-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">Description Caption</Label>
                    <Textarea value={state.formData.description} onChange={e => handlers.handleFormFieldChange('description', e.target.value)} placeholder="Provide a brief narrative or culinary description..." className="border-border rounded-sm px-3 py-2 focus:ring-primary min-h-[100px] leading-relaxed" data-api-unique-id="photosmanagementview-re6a85e255c1605bf-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" />
                  </div>
                </form>

                {!state.isFormValid && <Alert variant="destructive" className="rounded-none border-destructive bg-destructive/5 text-destructive p-4" data-api-unique-id="photosmanagementview-re1d6a8799a70d1e4-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
                    <div className="flex gap-3" data-api-unique-id="photosmanagementview-rb6cfb9725582abf9-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
                      <Info className="h-4 w-4 shrink-0" data-api-unique-id="photosmanagementview-r68941a912b19bd29-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" />
                      <AlertDescription className="text-xs font-medium leading-normal" data-api-unique-id="photosmanagementview-r593057afe86dfe4f-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
                        Operational Integrity Warning: All structural fields (URL, Alt Text, Description) must be defined before publishing to the gallery.
                      </AlertDescription>
                    </div>
                  </Alert>}
              </>}
          </div>

          <SheetFooter className="px-8 py-6 border-t border-border bg-muted/20 gap-3" data-api-unique-id="photosmanagementview-rbdf477cd3a07e9d1-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
            <Button variant="outline" className="flex-1 rounded-sm border-border hover:bg-muted hover:text-foreground h-11" onClick={handlers.handleClosePanel} disabled={state.isEditorSaving} data-api-unique-id="photosmanagementview-r90e04a891881b726-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
              Discard Changes
            </Button>
            <Button className="flex-[2] rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 h-11" onClick={handlers.handleSavePhoto} disabled={!state.isFormValid || state.isEditorSaving || state.isEditorLoading} data-api-unique-id="photosmanagementview-re2d9bcbbbee995e3-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
              {state.isEditorSaving ? <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" data-api-unique-id="photosmanagementview-rfcb72532bc8b97f6-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" />
                  Publishing...
                </> : 'Save Configuration'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* 5. Deletion Confirmation Modal */}
      <Dialog open={!!state.deleteTargetId} onOpenChange={open => !open && handlers.handleCloseDelete()} data-api-unique-id="photosmanagementview-r9eeb9bc898603a81-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
        <DialogContent className="rounded-none border-border max-w-md p-0 overflow-hidden shadow-md" data-api-unique-id="photosmanagementview-rc2a4664067cc7a4d-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
          <div className="p-8 pb-4" data-api-unique-id="photosmanagementview-r7534854a91fdc750-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
            <DialogHeader className="space-y-4" data-api-unique-id="photosmanagementview-r7c8ab4078c4d4241-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
              <div className="h-12 w-12 rounded-none bg-destructive/10 flex items-center justify-center text-destructive" data-api-unique-id="photosmanagementview-rb80b609bc7d9363e-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
                <Trash2 className="h-6 w-6" data-api-unique-id="photosmanagementview-rd85e6ff5897d6c65-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" />
              </div>
              <DialogTitle className="font-header text-2xl" data-api-unique-id="photosmanagementview-r9b474720d061954e-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">Confirm Destructive Action</DialogTitle>
              <DialogDescription className="text-muted-foreground leading-relaxed" data-api-unique-id="photosmanagementview-r978fb9539c3a15a6-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
                Warning: Removing this record will transition the slot <span className="font-bold text-foreground" data-api-unique-id="photosmanagementview-r0b34a9a53bf7d22d-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">"{state.deleteTargetId}"</span> to a <span className="font-bold text-foreground italic" data-api-unique-id="photosmanagementview-rd15f1f776150886c-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">MISSING</span> state. 
                The associated asset will be immediately purged from the homepage gallery.
              </DialogDescription>
            </DialogHeader>
          </div>
          <DialogFooter className="bg-muted/30 p-8 pt-4 flex gap-3 sm:justify-end" data-api-unique-id="photosmanagementview-r627846fa3d818ac8-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
            <Button variant="outline" className="rounded-sm border-border hover:bg-muted h-10 px-6" onClick={handlers.handleCloseDelete} disabled={state.isDeleting} data-api-unique-id="photosmanagementview-re1afefc89d98b5f4-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
              Cancel
            </Button>
            <Button variant="destructive" className="rounded-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-6 font-bold" onClick={handlers.handleConfirmDelete} disabled={state.isDeleting} data-api-unique-id="photosmanagementview-r4b4dde734ff7faa8-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView">
              {state.isDeleting ? <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" data-api-unique-id="photosmanagementview-r91aede6732259868-s2126413650" data-api-unique-page-name="src/backend/components/PhotosManagementView" />
                  Deleting...
                </> : 'Confirm Deletion'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
};