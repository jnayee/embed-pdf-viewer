'use client'

import { createPluginRegistration } from '@embedpdf/core'
import { EmbedPDF } from '@embedpdf/core/react'
import { usePdfiumEngine } from '@embedpdf/engines/react'
import {
  AnnotationLayer,
  AnnotationPluginPackage,
} from '@embedpdf/plugin-annotation/react'
import {
  InteractionManagerPluginPackage,
  PagePointerProvider,
} from '@embedpdf/plugin-interaction-manager/react'
import {
  DocumentContent,
  DocumentManagerPluginPackage,
} from '@embedpdf/plugin-document-manager/react'
import { RenderLayer, RenderPluginPackage } from '@embedpdf/plugin-render/react'
import { Scroller, ScrollPluginPackage } from '@embedpdf/plugin-scroll/react'
import {
  SelectionLayer,
  SelectionPluginPackage,
} from '@embedpdf/plugin-selection/react'
import {
  Viewport,
  ViewportPluginPackage,
} from '@embedpdf/plugin-viewport/react'
import { HistoryPluginPackage } from '@embedpdf/plugin-history/react'
import { ZoomPluginPackage, ZoomMode } from '@embedpdf/plugin-zoom/react'
import {
  FormPluginPackage,
  useFormCapability,
} from '@embedpdf/plugin-form/react'
import { Loader2, Wand2, Trash2 } from 'lucide-react'

const plugins = [
  createPluginRegistration(DocumentManagerPluginPackage, {
    initialDocuments: [{ url: '/form.pdf' }],
  }),
  createPluginRegistration(ViewportPluginPackage),
  createPluginRegistration(ScrollPluginPackage),
  createPluginRegistration(RenderPluginPackage),
  createPluginRegistration(ZoomPluginPackage, {
    defaultZoomLevel: ZoomMode.FitPage,
  }),
  createPluginRegistration(InteractionManagerPluginPackage),
  createPluginRegistration(SelectionPluginPackage),
  createPluginRegistration(HistoryPluginPackage),
  createPluginRegistration(AnnotationPluginPackage, {
    locked: { type: 'include', categories: ['form'] },
  }),
  createPluginRegistration(FormPluginPackage),
]

const FormAutoFillToolbar = ({ documentId }: { documentId: string }) => {
  const { provides: formCapability } = useFormCapability()

  const handleFillDemoData = () => {
    if (!formCapability) return
    const scope = formCapability.forDocument(documentId)

    const demoData: Record<string, string> = {
      First_Name: 'Jane',
      Last_Name: 'Doe',
      Email_Address: 'jane.doe@example.com',
      Phone_Number: '+1 (555) 123-4567',
      Home_Address: '123 Main Street',
      City: 'San Francisco',
      State: 'CA',
      Postal_Code: '94102',
      Department: 'Design ',
      Employment_Type: 'Contract',
      Office_Location: 'San Francisco',
      Start_Date: '2026-04-01',
      Programming_Languages: 'TypeScript, Rust, Go',
      Framework_Tools: 'React, Node.js, Docker',
      Comments:
        'I would like to have a standing desk and a dual monitor setup.',
      Equipment_Laptop: 'Yes',
      Equipment_Monitor: 'Yes',
      Equipment_Keyboard: 'Yes',
      Equipment_Desk: 'Yes',
      Access_Repository: 'Yes',
      Access_Cloud: 'Yes',
      Access_Internal: 'Yes',
      Access_VPN: 'Yes',
      Terms: 'Yes',
    }

    scope.setFormValues(demoData)
  }

  const handleClearForm = () => {
    if (!formCapability) return
    const scope = formCapability.forDocument(documentId)

    const emptyData: Record<string, string> = {
      First_Name: '',
      Last_Name: '',
      Email_Address: '',
      Phone_Number: '',
      Home_Address: '',
      City: '',
      State: '',
      Postal_Code: '',
      Department: 'Engineering',
      Employment_Type: 'Full-time',
      Office_Location: 'New York',
      Start_Date: '',
      Programming_Languages: '',
      Framework_Tools: '',
      Comments: '',
      Equipment_Laptop: 'Off',
      Equipment_Monitor: 'Off',
      Equipment_Keyboard: 'Off',
      Equipment_Desk: 'Off',
      Access_Repository: 'Off',
      Access_Cloud: 'Off',
      Access_Internal: 'Off',
      Access_VPN: 'Off',
      Terms: 'Off',
    }

    scope.setFormValues(emptyData)
  }

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-gray-300 bg-gray-100 px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
      <span className="tracking-wide text-xs font-medium uppercase text-gray-600 dark:text-gray-300">
        Demo Actions
      </span>
      <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />

      <button
        onClick={handleFillDemoData}
        className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      >
        <Wand2 size={16} />
        Auto Fill Data
      </button>

      <button
        onClick={handleClearForm}
        className="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        <Trash2 size={16} />
        Clear Form
      </button>
    </div>
  )
}

export const FormImportViewer = () => {
  const { engine, isLoading } = usePdfiumEngine()

  if (isLoading || !engine) {
    return (
      <div className="overflow-hidden rounded-lg border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div className="flex h-[400px] items-center justify-center">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">Loading PDF Engine...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <EmbedPDF engine={engine} plugins={plugins}>
      {({ activeDocumentId }) =>
        activeDocumentId && (
          <DocumentContent documentId={activeDocumentId}>
            {({ isLoaded }) =>
              isLoaded && (
                <div
                  className="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
                  style={{ userSelect: 'none' }}
                >
                  {/* Toolbar */}
                  <FormAutoFillToolbar documentId={activeDocumentId} />

                  {/* PDF Viewer */}
                  <div className="relative h-[450px] sm:h-[550px]">
                    <Viewport
                      documentId={activeDocumentId}
                      className="absolute inset-0 bg-gray-200 dark:bg-gray-800"
                    >
                      <Scroller
                        documentId={activeDocumentId}
                        renderPage={({ pageIndex }) => (
                          <PagePointerProvider
                            documentId={activeDocumentId}
                            pageIndex={pageIndex}
                          >
                            <RenderLayer
                              documentId={activeDocumentId}
                              pageIndex={pageIndex}
                              style={{ pointerEvents: 'none' }}
                            />
                            <SelectionLayer
                              documentId={activeDocumentId}
                              pageIndex={pageIndex}
                            />
                            <AnnotationLayer
                              documentId={activeDocumentId}
                              pageIndex={pageIndex}
                            />
                          </PagePointerProvider>
                        )}
                      />
                    </Viewport>
                  </div>
                </div>
              )
            }
          </DocumentContent>
        )
      }
    </EmbedPDF>
  )
}
