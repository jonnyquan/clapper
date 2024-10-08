'use client'

import { ClapWorkflowCategory, ClapWorkflowProvider } from '@aitube/clap'

import {
  MenubarCheckboxItem,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
} from '@/components/ui/menubar'

import { TagColor } from '@/components/tags/types'
import { Tag } from '@/components/tags/Tag'
import { useSettings } from '@/services/settings'
import { cn } from '@/lib/utils'

import { hasNoPublicAPI } from './hasNoPublicAPI'
import { useWorkflowEditor } from '@/services/editors'
import { findWorkflows } from './getWorkflowProviders'
import {
  ClapWorkflowProviderLogo,
  ClapWorkflowProviderName,
} from '@/components/core/providers'

export function ImageDepthWorkflows() {
  const workflowId = useSettings((s) => s.imageDepthWorkflow)
  const setWorkflowId = useSettings((s) => s.setImageDepthWorkflow)
  const availableWorkflows = useWorkflowEditor((s) => s.availableWorkflows)

  const { workflows, providers, nbProviders } = findWorkflows(
    availableWorkflows,
    { category: ClapWorkflowCategory.IMAGE_DEPTH_MAPPING }
  )

  const { workflow } = findWorkflows(workflows, { workflowId })

  if (!nbProviders) {
    return null
  }

  return (
    <MenubarSub>
      <MenubarSubTrigger>
        <Tag size="lg" color={TagColor.SLATE}>
          depth&nbsp;mapper
        </Tag>
        <div className={cn(`flex flex-row items-center space-x-2`)}>
          <ClapWorkflowProviderLogo
            provider={workflow?.provider}
            height={18}
            className={cn(`rounded-full`)}
          />
          <div>{workflow?.label || 'None'}</div>
        </div>
      </MenubarSubTrigger>
      <MenubarSubContent>
        {Object.entries(providers).map(([p, workflows]) => (
          <MenubarSub key={p}>
            <MenubarSubTrigger>
              <ClapWorkflowProviderName>
                {p as ClapWorkflowProvider}
              </ClapWorkflowProviderName>
            </MenubarSubTrigger>
            <MenubarSubContent>
              {workflows.map((w) => (
                <MenubarCheckboxItem
                  key={w.id}
                  checked={workflowId === w.id}
                  disabled={hasNoPublicAPI(w)}
                  onClick={(e) => {
                    if (hasNoPublicAPI(w)) {
                      e.stopPropagation()
                      e.preventDefault()
                      return false
                    }
                    setWorkflowId(w.id)
                    e.stopPropagation()
                    e.preventDefault()
                    return false
                  }}
                >
                  {w.label}
                </MenubarCheckboxItem>
              ))}
            </MenubarSubContent>
          </MenubarSub>
        ))}
      </MenubarSubContent>
    </MenubarSub>
  )
}
