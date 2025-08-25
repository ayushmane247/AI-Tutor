import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Smartphone, Tablet, Monitor, Laptop } from 'lucide-react';

export default function ResponsiveTest() {
  const breakpoints = [
    { name: 'Mobile', icon: Smartphone, size: 'xs (475px)', classes: 'block xs:hidden' },
    { name: 'Small', icon: Smartphone, size: 'sm (640px)', classes: 'hidden xs:block sm:hidden' },
    { name: 'Medium', icon: Tablet, size: 'md (768px)', classes: 'hidden sm:block md:hidden' },
    { name: 'Large', icon: Laptop, size: 'lg (1024px)', classes: 'hidden md:block lg:hidden' },
    { name: 'XL', icon: Monitor, size: 'xl (1280px)', classes: 'hidden lg:block xl:hidden' },
    { name: '2XL', icon: Monitor, size: '2xl (1536px)', classes: 'hidden xl:block' }
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-responsive-xl">Responsive Design Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Breakpoint Indicator */}
          <div className="space-y-2">
            <h3 className="text-responsive-lg font-semibold">Current Screen Size:</h3>
            <div className="flex flex-wrap gap-2">
              {breakpoints.map((bp) => (
                <Badge key={bp.name} className={`${bp.classes} flex items-center gap-2`}>
                  <bp.icon className="w-4 h-4" />
                  {bp.name} - {bp.size}
                </Badge>
              ))}
            </div>
          </div>

          {/* Grid Test */}
          <div className="space-y-4">
            <h3 className="text-responsive-lg font-semibold">Responsive Grid Test</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <Card key={item} className="p-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <span className="text-responsive-base font-bold">{item}</span>
                    </div>
                    <p className="text-responsive-sm">Grid Item {item}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Typography Test */}
          <div className="space-y-4">
            <h3 className="text-responsive-lg font-semibold">Responsive Typography</h3>
            <div className="space-y-2">
              <h1 className="text-responsive-3xl font-bold">Heading 1 (3xl)</h1>
              <h2 className="text-responsive-2xl font-bold">Heading 2 (2xl)</h2>
              <h3 className="text-responsive-xl font-bold">Heading 3 (xl)</h3>
              <h4 className="text-responsive-lg font-bold">Heading 4 (lg)</h4>
              <p className="text-responsive-base">Body text (base)</p>
              <p className="text-responsive-sm">Small text (sm)</p>
              <p className="text-responsive-xs">Extra small text (xs)</p>
            </div>
          </div>

          {/* Button Test */}
          <div className="space-y-4">
            <h3 className="text-responsive-lg font-semibold">Responsive Buttons</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="btn-responsive">Responsive Button</Button>
              <Button variant="outline" className="btn-responsive">Outline Button</Button>
              <Button size="icon" className="btn-responsive-icon">
                <Monitor className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Spacing Test */}
          <div className="space-y-4">
            <h3 className="text-responsive-lg font-semibold">Responsive Spacing</h3>
            <div className="p-responsive bg-muted rounded-lg">
              <p className="text-responsive-base">This container uses responsive padding</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-responsive">
              <div className="p-4 bg-primary/10 rounded">Item 1</div>
              <div className="p-4 bg-primary/10 rounded">Item 2</div>
            </div>
          </div>

          {/* Visibility Test */}
          <div className="space-y-4">
            <h3 className="text-responsive-lg font-semibold">Responsive Visibility</h3>
            <div className="space-y-2">
              <div className="hidden-mobile p-4 bg-green-100 dark:bg-green-900 rounded">
                Hidden on mobile (sm and up)
              </div>
              <div className="hidden-desktop p-4 bg-blue-100 dark:bg-blue-900 rounded">
                Hidden on desktop (mobile only)
              </div>
              <div className="hidden-tablet p-4 bg-purple-100 dark:bg-purple-900 rounded">
                Hidden on tablet (mobile and desktop only)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
